const Taskfiles = require('../../models/briefupload');
const User = require('../../models/user');
const Notification = require('../../models/notification');
const Taskcomm = require('../../models/comm');
const { ObjectId } = require('mongoose').Types;
const { matchReqNSendNotification } = require('../../util/socket-io');

var mime = require('mime-types');
//Simple version, without validation or sanitation
exports.test = function (req, res) {
  res.send('Greetings from the task controller!');
};

const sendNotificationForBriefUpload = async (type, payload, req) => {
  let actionEffectsToIds = await User.find({
    user_type: 'Employee',
    'employee.user_role': 'SuperAdmin',
  }).select('_id');
  actionEffectsToIds = actionEffectsToIds.filter(function (obj) {
    return String(obj._id) !== String(req.decoded.userId);
  });
  switch (type) {
    case 'taskBriefUpload':
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

        let title = `Brief for ${req.params.id} task uploaded.`;
        let subTitle = `by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: 'Task',
          actionTakenById: req.decoded.userId,
          resourceId: [...payload],
          typeof: 'Task Brief Upload',
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: '/su/task/' + req.params.id,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        await NotificationCreate.save();
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle, action: '/su/task/' + req.params.id },
          'taskSolutionUpload'
        );
      }
      break;

    default:
      break;
  }
};

exports.taskfiles_create = async (req, res, next) => {
  // var datatype = mime.extension(req.file.mimetype);
  // var uploadpathoffile =
  //   "https://zmyrnpacflqa.nyc3.digitaloceanspaces.com/" + req.file.key;
  console.log('here');
  let insertBriefFiles = [];
  req.files.forEach((element) => {
    insertBriefFiles.push({
      files: element.originalname,
      taskid: req.params.id,
      uploadpath:
        'https://zmyrnpacflqa.nyc3.digitaloceanspaces.com/' + element.key,
      filetype: mime.extension(element.mimetype),
      filesize: element.size,
      uploadedby: req.decoded.userId,
    });
  });
  try {
    // let taskfiles = new Taskfiles({
    //   files: req.file.originalname,
    //   taskid: req.params.id,
    //   uploadpath: uploadpathoffile,
    //   filetype: datatype,
    //   filesize: req.file.size,
    //   uploadedby: req.decoded.userId
    // });
    // var uploadedbrief = await taskfiles.save();

    let createTaskFiles = await Taskfiles.insertMany(insertBriefFiles);
    sendNotificationForBriefUpload('taskBriefUpload', createTaskFiles, req);
    res.status(201).send(createTaskFiles);
  } catch (e) {
    console.log(e);
    res.status(400).send({ error: e.errmsg });
  }
};

exports.taskfiles_view = function (req, res, next) {
  Taskfiles.find(function (err, product) {
    if (err) return next(err);
    res.send(product);
  });
};

exports.taskfiles_view_id = async (req, res) => {
  var assessmentbrief = await Taskfiles.aggregate([
    { $match: { taskid: req.params.id } },
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
  await User.populate(assessmentbrief, { select: 'name', path: 'uploadedby' });
  res.send(assessmentbrief);
};
exports.taskfiles_update = function (req, res, next) {
  Taskfiles.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    function (err, data) {
      res.send(data);
    }
  );
};

exports.taskfiles_delete = function (req, res, next) {
  Taskfiles.findByIdAndRemove(req.params.id, function (err) {
    if (err) return next(err);
    res.send('Deleted successfully!');
  });
};
