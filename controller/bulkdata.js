const BulkData = require('../models/bulkdata');
const StreamArray = require('stream-json/streamers/StreamArray');
const path = require('path');
const fs = require('fs');
var https = require('https');
const jsonStream = StreamArray.withParser();
var shell = require('shelljs');
var { NumberDecimal } = require('mongoose');
const Task = require('../models/task');
var emitter = require('events').EventEmitter;
var Comm = require('../models/comm');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

exports.post_datalink_bulk = async (req, res, next) => {
  try {
    let counter = 0,
      createBulk = [];
    jsonStream.on('data', ({ key, value }) => {
      var str = value.link.slice(58);
      var regtaskkey = str.match(/.*?(?=\/|$)/i)[0];
      var matchesyear = str.match(/\/([1-2][09][0-9]{2})\/([0-1]?[0-9])\//);

      ///var year = parseFloat( matches[1] );
      if (regtaskkey) {
        var taskid = regtaskkey;
        var status = '';
        var strng =
          'https://locusbucket.s3.amazonaws.com/locustool/media/file/' +
          taskid +
          '/';
        var datalink = value.link.replace(strng, '');
        var getfiletype1 = datalink.match(/solution/);
        var getfiletype2 = datalink.match(/feedback/);
        var getfiletype3 = datalink.match(/task/);
        if (getfiletype1) {
          status = getfiletype1[0];
        }
        if (getfiletype2) {
          status = getfiletype2[0];
        }
        if (getfiletype3) {
          status = getfiletype3[0];
        }
      }
      if (matchesyear) {
        var taskyear = matchesyear[1];
        var taskmonth = matchesyear[2];
      }

      if (createBulk.length > 1000) {
        counter += createBulk.length;
        onlyUnique(createBulk);
        createBulk = [];
        console.log(`Inserted ${counter}. Inserting further`);
      }
      // const bulkdata = new BulkData({
      //   taskid: taskid,
      //   Year: taskyear,
      //   Month: taskmonth,
      //   Link: value.link,
      //   uploadtype: status,
      // });
      // onlyUnique(bulkdata);
      createBulk.push({
        taskid: taskid,
        Year: taskyear,
        Month: taskmonth,
        Link: value.link,
        uploadtype: status,
      });
    });

    jsonStream.on('end', () => {
      console.log('Completed');
      res.json({
        msg: 'done',
      });
    });
    const filename = path.join(__dirname, 'myjsonfile.json');
    fs.createReadStream(filename).pipe(jsonStream.input);
  } catch (error) {
    next(error);
  }
};

async function onlyUnique(bulkdata) {
  try {
    // var bdata = await bulkdata.save();
    var bdata = await BulkData.insertMany(bulkdata);
  } catch (e) {
    console.log(e);
  }
}

exports.get_year_datafiles = async (req, res, next) => {
  try {
    var yearlydata = await BulkData.aggregate([
      {
        $project: {
          _id: 0,
          Year: 1,
          taskid: 1,
          Link: 1,
        },
      },
      {
        $group: {
          _id: '$Year',
          totaltask: { $sum: 1 },
        },
      },
    ]);
    res.send(yearlydata);
  } catch (e) {
    next(e);
  }
};

exports.get_year_data = async (req, res, next) => {
  try {
    var yearlydata = await BulkData.distinct('taskid', {
      Year: req.query.year,
    });
    var length = yearlydata.length;
    res.json({ length, yearlydata });
  } catch (e) {
    next(e);
  }
};
exports.get_download_data = async (req, res, next) => {
  var skipnumber = parseInt(req.query.skip);
  var limitnumber = parseInt(req.query.limit);
  var yearnumber = parseInt(req.query.year);
  var monthnumber = parseInt(req.query.month);
  try {
    var yearlydata = await BulkData.aggregate([
      {
        $match: {
          $and: [{ Year: yearnumber }, { Month: monthnumber }],
        },
      },
      { $sort: { taskid: 1 } },
      { $group: { _id: '$taskid' } },
      { $sort: { _id: 1 } },
      { $skip: skipnumber },
      { $limit: limitnumber },
    ]);
    yearlydata.forEach(downloadfile);
    res.json(yearlydata);
  } catch (e) {
    next(e);
  }
};
async function downloadfile(item, index) {
  try {
    var bdata = await BulkData.find({ taskid: item._id });
    for (var i = 0; i < bdata.length; i++) {
      if (!fs.existsSync('bulkdata/' + item._id)) {
        fs.mkdirSync('bulkdata/' + item._id);
      }
      if (!fs.existsSync('bulkdata/' + item._id + '/' + bdata[i].uploadtype)) {
        fs.mkdirSync('bulkdata/' + item._id + '/' + bdata[i].uploadtype);
      }
      var url = bdata[i].Link;
      var filename = url.substring(url.lastIndexOf('/') + 1);
      var str =
        'bulkdata/' + item._id + '/' + bdata[i].uploadtype + '/' + filename;
      await download(url, str, item._id);
    }
  } catch (e) {
    console.log(e);
  }
}
var download = function (url, dest, key, cb) {
  var file = fs.createWriteStream(dest);
  var request = https
    .get(url, function (response) {
      response.pipe(file);
      file.on('finish', function () {
        console.log('Downloaded: ' + dest); // close() is async, call cb after close completes.
      });
    })
    .on('error', function (err, next) {
      // Handle errors
      fs.unlink(dest);
      console.log(key + '++' + dest); // Delete the file async. (But we don't check the result)
      if (cb) next(err.message);
    });
};

exports.get_table_data = async (req, res, next) => {
  var skipnumber = parseInt(req.query.start);
  var limitnumber = parseInt(req.query.length);
  try {
    if (req.query.search.value) {
      var clength = await BulkData.aggregate([
        {
          $match: {
            $text: { $search: req.query.search.value },
            taskid: { $exists: true },
          },
        },
        {
          $project: {
            _id: 0,
            Year: 1,
            taskid: 1,
            Month: 1,
            uploadtype: 1,
            Link: 1,
          },
        },
        { $sort: { taskid: 1 } },
      ]).allowDiskUse(true);
      var yearlydata = await BulkData.aggregate([
        {
          $match: {
            $text: { $search: req.query.search.value },
            taskid: { $exists: true },
          },
        },
        {
          $project: {
            _id: 0,
            Year: 1,
            taskid: 1,
            Month: 1,
            uploadtype: 1,
            Link: 1,
          },
        },
        { $sort: { taskid: 1 } },
        { $skip: skipnumber },
        { $limit: limitnumber },
      ]).allowDiskUse(true);
      var countlength = clength.length;
    } else {
      var yearlydata = await BulkData.aggregate([
        {
          $match: { taskid: { $exists: true } },
        },
        {
          $project: {
            _id: 0,
            Year: 1,
            taskid: 1,
            Month: 1,
            uploadtype: 1,
            Link: 1,
          },
        },
        { $sort: { taskid: 1 } },
        { $skip: skipnumber },
        { $limit: limitnumber },
      ]).allowDiskUse(true);
      var countlength = await BulkData.count();
    }
    res.json({
      recordsTotal: countlength,
      recordsFiltered: countlength,
      data: yearlydata,
    });
  } catch (e) {
    console.log(e);
    next(e);
  }
};

exports.get_graph_locus = async (req, res, next) => {
  try {
    var locusstats = await BulkData.aggregate([
      {
        $group: {
          _id: {
            Year: '$Year',
            taskkey: '$taskid',
          },
          totalfiles: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: '$_id.Year',
          totaktask: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.send(locusstats);
  } catch (e) {
    next(e);
  }
};

exports.post_taskcomm = async (req, res, next) => {
  try {
    var taskdata = await Task.find();
    var num = taskdata.length;
    var count = 0;
    for (var i = 0; i < num; i++) {
      count = count + 1;
      const comm = new Comm({
        taskid: taskdata[i]._id,
      });
      var bdata = await comm.save();
      console.log('Count: ' + count);
    }
    res.json(num);
  } catch (e) {
    console.log(e);
  }
};

exports.put_task = async (req, res, next) => {
  try {
    var Commdata = await Comm.find();
    var num = Commdata.length;
    var count = 0;
    for (var i = 0; i < num; i++) {
      count = count + 1;
      var bdata = await Task.updateOne(
        { _id: Commdata[i].taskid },
        { $set: { taskcomm: ObjectId(Commdata[i]._id) } }
      );
      console.log('Count: ' + count);
    }
    res.json(num);
  } catch (e) {
    console.log(e);
  }
};
