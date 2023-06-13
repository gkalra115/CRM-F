const Solution = require('../../models/solutionupload');
const Comment = require('../../models/comments');
const User = require('../../models/user');
const Task = require('../../models/task');
const TaskFiles = require('../../models/briefupload');
const TaskComm = require('../../models/comm');
const AWS = require('aws-sdk');
var mime = require('mime-types');
const {
  wrapedSendMail,
  generateEmailTemplateWithFile,
} = require('../../util/nodemailer');
const { Schema } = require('mongoose');
const Notification = require('../../models/notification');
const Taskcomm = require('../../models/comm');
const { ObjectId } = require('mongoose').Types;
const {
  matchReqNSendNotification,
  expemtActionTakingId,
} = require('../../util/socket-io');

const sendNotificationForSolutionUpload = async (type, payload, req) => {
  let actionEffectsToIds = await User.find({
    user_type: 'Employee',
    'employee.user_role': 'SuperAdmin',
  }).select('_id');
  actionEffectsToIds = expemtActionTakingId(
    actionEffectsToIds,
    req.decoded.userId
  );
  switch (type) {
    case 'taskSolutionUpload':
      {
        let taskRelatedIds = await Taskcomm.findOne({
          taskid: req.params.id,
        }).select('Admin Expert TeamLead Manager -_id');
        actionEffectsToIds = [
          ...actionEffectsToIds,
          ...Object.values(taskRelatedIds['_doc']).map((el) => {
            return { _id: ObjectId(el) };
          }),
        ];
        actionEffectsToIds = expemtActionTakingId(
          actionEffectsToIds,
          req.decoded.userId
        );
        let title = `Solution for ${req.params.id} task uploaded.`;
        let subTitle = `by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: 'Task',
          actionTakenById: req.decoded.userId,
          resourceId: [...payload],
          typeof: 'Task Solution Upload',
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: '/su/task/' + req.params.id,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle, action: '/su/task/' + req.params.id },
          'taskSolutionUpload'
        );
      }
      break;
    case 'taskSolutionSentClient':
      {
        let taskRelatedIds = await Taskcomm.findOne({
          taskid: payload.taskId,
        }).select('Admin -_id');
        if (!!taskRelatedIds) {
          actionEffectsToIds = [
            ...actionEffectsToIds,
            ...Object.values(taskRelatedIds['_doc']).map((el) => {
              return { _id: ObjectId(el) };
            }),
          ];
        }
        actionEffectsToIds = expemtActionTakingId(
          actionEffectsToIds,
          req.decoded.userId
        );
        let title = `Solution for ${payload.taskId} sent to client.`;
        let subTitle = `by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: 'Task',
          actionTakenById: req.decoded.userId,
          resourceId: payload,
          typeof: 'Task Solution Send',
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: '/su/task/' + payload.taskId,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        await NotificationCreate.save();
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle, action: '/su/task/' + req.params.id },
          'taskSolutionSentClient'
        );
      }
      break;
    default:
      break;
  }
};
//Simple version, without validation or sanitation

exports.solution_create = async (req, res, next) => {
  let insertSolutionFiles = [];
  req.files.forEach((element) => {
    insertSolutionFiles.push({
      files: element.originalname,
      taskid: req.params.id,
      uploadpath:
        'https://zmyrnpacflqa.nyc3.digitaloceanspaces.com/' + element.key,
      filetype: mime.extension(element.mimetype),
      filesize: element.size,
      uploadedby: req.decoded.userId,
    });
  });
  // var datatype = mime.extension(req.file.mimetype);
  // var uploadpathoffile =
  //   "https://zmyrnpacflqa.nyc3.digitaloceanspaces.com/" + req.file.key;
  try {
    // let solution = new Solution({
    //   files: req.file.originalname,
    //   taskid: req.params.id,
    //   uploadpath: uploadpathoffile,
    //   filetype: datatype,
    //   filesize: req.file.size,
    //   uploadedby: req.decoded.userId
    // });
    // var uploadedbrief = await solution.save();
    // res.status(201).send(uploadedbrief);
    let createSolutionFiles = await Solution.insertMany(insertSolutionFiles);
    await sendNotificationForSolutionUpload(
      'taskSolutionUpload',
      createSolutionFiles,
      req
    );
    res.status(201).send(createSolutionFiles);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.solution_file_get = async function (req, res, next) {
  try {
    const { type, id } = req.params;
    let file;
    if (type === 'solution') {
      file = await Solution.findOne({
        _id: ObjectId(id),
      });
    } else {
      file = await TaskFiles.findOne({
        _id: ObjectId(id),
      });
    }
    if (type === 'comment') {
      let cfile = await Comment.findOne({
        _id: ObjectId(id),
      });
      file = cfile.commentFile;
    }
    if (!file) {
      return res.status(400).json({
        msg: 'No file found !!!',
      });
    }
    let key = decodeURIComponent(file.uploadpath).replace(
      'https://zmyrnpacflqa.nyc3.digitaloceanspaces.com/',
      ''
    );
    var bucketParams = {
      Bucket: 'zmyrnpacflqa',
      Key: key,
    };
    const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
    const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: 'YWIGNHOGQNDYSGB6WDMM',
      secretAccessKey: '4yEuWAlkZTsBK3a8nkez8XgvOD1tELWW0ZQUoc6zyM4',
    });
    s3.getObject(bucketParams, function (err, data) {
      if (err) {
        return res.status(400).json({
          msg: 'File Not Foud !!!',
        });
      } else {
        res.attachment(key);
        s3.getObject(bucketParams).createReadStream().pipe(res);
      }
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.solution_view = function (req, res, next) {
  Solution.find(function (err, product) {
    if (err) return next(err);
    res.send(product);
  });
};

exports.solution_view_id = async (req, res) => {
  try {
    let addCheck =
      req.decoded.userDetails.user_role === 'Expert'
        ? {
            uploadedby: ObjectId(req.decoded.userId),
          }
        : {};
    var assessmentsolution = await Solution.aggregate([
      { $match: { taskid: req.params.id, ...addCheck } },
      {
        $project: {
          _id: 1,
          files: 1,
          uploadpath: 1,
          createdAt: 1,
          uploadedby: 1,
          fileUrl: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$filetype', 'css'] },
                  then: '/assets/media/files/css.svg',
                },
                {
                  case: { $eq: ['$filetype', 'csv'] },
                  then: '/assets/media/files/csv.svg',
                },
                {
                  case: { $eq: ['$filetype', 'doc'] },
                  then: '/assets/media/files/doc.svg',
                },
                {
                  case: { $eq: ['$filetype', 'docx'] },
                  then: '/assets/media/files/doc.svg',
                },
                {
                  case: { $eq: ['$filetype', 'html'] },
                  then: '/assets/media/files/html.svg',
                },
                {
                  case: { $eq: ['$filetype', 'htm'] },
                  then: '/assets/media/files/html.svg',
                },
                {
                  case: { $eq: ['$filetype', 'js'] },
                  then: '/assets/media/files/javascript.svg',
                },
                {
                  case: { $eq: ['$filetype', 'jpg'] },
                  then: '/assets/media/files/jpg.svg',
                },
                {
                  case: { $eq: ['$filetype', 'jpeg'] },
                  then: '/assets/media/files/jpg.svg',
                },
                {
                  case: { $eq: ['$filetype', 'pdf'] },
                  then: '/assets/media/files/pdf.svg',
                },
                {
                  case: { $eq: ['$filetype', 'xml'] },
                  then: '/assets/media/files/xml.svg',
                },
                {
                  case: { $eq: ['$filetype', 'zip'] },
                  then: '/assets/media/files/zip.svg',
                },
              ],
              default: '/assets/media/files/files.svg',
            },
          },
        },
      },
    ]);
    await User.populate(assessmentsolution, {
      select: 'name',
      path: 'uploadedby',
    });
    res.status(200).send(assessmentsolution);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.solution_update = function (req, res, next) {
  Solution.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    function (err, data) {
      res.send(data);
    }
  );
};

exports.solution_delete = function (req, res, next) {
  Solution.findByIdAndRemove(req.params.id, function (err) {
    if (err) return next(err);
    res.send('Deleted successfully!');
  });
};

exports.solution_send_to_client = async (req, res, next) => {
  try {
    let { files, taskId } = req.body;
    files = JSON.parse(files);

    const taskDetails = await Task.findOne({ _id: taskId }).populate({
      select: 'email name',
      path: 'client',
    });
    if (!taskDetails) {
      return res.status(404).json({
        error: 'Not Found',
        msg: 'No such task was found',
      });
    }
    const { client, taskcomm, title, wordcount, hard_deadline } = taskDetails;
    const filesWithLinks = await Solution.find({
      _id: {
        $in: files,
      },
    });
    const emailTemplate = generateEmailTemplateWithFile({
      name: client.name,
      title: title,
      data: filesWithLinks,
    });
    var mailOptions = {
      from: 'squalosolutions@gmail.com',
      to: client.email,
      subject: `Solution files for ${title}`,
      html: emailTemplate,
    };
    const updateTaskComm = await TaskComm.updateOne(
      { _id: taskcomm },
      {
        $push: {
          tasklogs: {
            assignedby: req.decoded.userId,
            assignedto: client._id,
            softdeadline: null,
            assignedon: new Date(),
            fileIds: files,
          },
        },
      }
    );
    if (!updateTaskComm.nModified > 0 && !updateTaskComm.ok > 0) {
      throw 'Not able to send mail comm not updated!!';
    }
    const response = await wrapedSendMail(mailOptions);
    if (!response) {
      throw 'Not able send mail to the client';
    }
    sendNotificationForSolutionUpload(
      'taskSolutionSentClient',
      { files, taskId },
      req
    );
    res.json({
      status: 'OK',
      msg: `Mail sent with solutions at ${client.email}`,
    });
  } catch (error) {
    res.status(500).json({
      msg: error.message,
    });
  }
};
