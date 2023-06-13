//importing models from schema
const Status = require("../../models/status");
const Notification = require("../../models/notification");
const Taskcomm = require("../../models/comm");

const { matchReqNSendNotification } = require('../../util/socket-io')

const sendNotificationForStatus = async (type, payload, req) => {
  let actionEffectsToIds = await User.find({user_type : "Employee", "employee.user_role" : "SuperAdmin"}).select("_id")
  actionEffectsToIds = actionEffectsToIds.filter(function( obj ) {
    return String(obj._id) !== String(req.decoded.userId);
  });
  switch (type) {
    case "taskStatusChange":
      {
        let taskRelatedIds = await Taskcomm.findOne({taskid : req.params.id}).select("Admin Expert TeamLead Manager -_id")
        actionEffectsToIds = [...actionEffectsToIds,...(Object.values(taskRelatedIds["_doc"])).map(el => {return {_id : ObjectId(el)}})]

        let title = `Task(s) ${req.params.id} status updated to ${req.body.status}.`
        let subTitle = `by ${req.decoded.email}`
        const NotificationCreate = new Notification({
          resource : "Task",
          actionTakenById : req.decoded.userId,
          resourceId : [req.params.id],
          typeof : "Status",
          actionEffectsToId : actionEffectsToIds,
          title : title,
          subTitle : subTitle,
          action : "/su/task/" + req.params.id
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) { 
          return String(el._id); 
        });  
        await NotificationCreate.save()
        matchReqNSendNotification(actionEffectsToIds, { title , subTitle, action : "/su/task/" + req.params.id }, 'taskStatusChange')
      }
    break;
    default:
      break;
  }
}

//view all status
exports.get_status_all = async (req, res, next) => {
  try {
    var allstatus = await Status.find();
    res.status(200).send({
      status: "OK",
      data: allstatus
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view single status details
exports.get_status_single = async (req, res, next) => {
  try {
    var singlestatus = await Status.findById(req.params.id);
    res.status(200).send(singlestatus);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//update status details
exports.put_status_update = async (req, res, next) => {
  try {
    var updatestatus = await Status.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status
      },
      { new: true }
    );
    await sendNotificationForStatus('taskStatusChange', null, req)
    res.status(200).send(updatestatus);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};
