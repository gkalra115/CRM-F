//importing models from schema
const Comm = require("../../models/comm");
const User = require("../../models/user");
const Status = require("../../models/status");
const Notification = require("../../models/notification");
const ObjectId = require("mongoose").Types.ObjectId;

const { matchReqNSendNotification } = require("../../util/socket-io");

const sendNotificationForComm = async (type, payload, req) => {
  let actionEffectsToIds = await User.find({
    user_type: "Employee",
    "employee.user_role": "SuperAdmin",
  }).select("_id");
  actionEffectsToIds = actionEffectsToIds.filter(function (obj) {
    return String(obj._id) !== String(req.decoded.userId);
  });
  switch (type) {
    case "taskCommStatus":
      {
        let user_roles = ["Admin", "Manager", "TeamLead", "Expert"];
        let rolesToFetch = [];
        for (
          let i = 0;
          i <= user_roles.indexOf(payload.user.employee.user_role);
          i++
        ) {
          if (!!payload.comm[user_roles[i]]) {
            rolesToFetch.push({ _id: ObjectId(payload.comm[user_roles[i]]) });
          }
        }
        actionEffectsToIds = [...actionEffectsToIds, ...rolesToFetch];
        let title = `${req.params.id} task status updated.`;
        let subTitle = `by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: "Task",
          actionTakenById: req.decoded.userId,
          resourceId: req.params.id,
          typeof: "CommStatus",
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: "/su/task/" + req.params.id,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        await NotificationCreate.save();
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle, action: "/su/task/" + req.params.id },
          "taskCommStatus"
        );
      }
      break;

    default:
      break;
  }
};

//view all comm
exports.get_comm_all = async (req, res, next) => {
  try {
    var allcomm = await Comm.find();
    res.status(200).send({
      status: "OK",
      data: allcomm,
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view single comm details
exports.get_comm_single = async (req, res, next) => {
  try {
    var singlecomm = await Comm.findOne({ taskid: req.params.id });
    res.status(200).send(singlecomm);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//update comm details
exports.put_comm_update = async (req, res, next) => {
  var datetime = new Date();
  try {
    const commdata = {
      assignedby: req.decoded.userId,
      assignedto: req.body.assignedto,
      softdeadline: req.body.softdeadline,
      assignedon: datetime,
    };
    var assignedtodetails = await User.findById(req.body.assignedto);
    var role_current = assignedtodetails.employee.user_role;
    if (role_current == "Admin") {
      var updatecomm = await Comm.findOneAndUpdate(
        { taskid: req.params.id },
        {
          $push: { tasklogs: commdata },
          $set: { Admin: req.body.assignedto },
        },
        { new: true }
      );
    } else if (role_current == "Manager") {
      var updatecomm = await Comm.findOneAndUpdate(
        { taskid: req.params.id },
        {
          $push: { tasklogs: commdata },
          $set: { Manager: req.body.assignedto },
        },
        { new: true }
      );
    } else if (role_current == "TeamLead") {
      var updatecomm = await Comm.findOneAndUpdate(
        { taskid: req.params.id },
        {
          $push: { tasklogs: commdata },
          $set: { TeamLead: req.body.assignedto },
        },
        { new: true }
      );
    } else if (role_current == "Expert") {
      var updatecomm = await Comm.findOneAndUpdate(
        { taskid: req.params.id },
        {
          $push: { tasklogs: commdata },
          $set: { Expert: req.body.assignedto },
        },
        { new: true }
      );
    }

    var status = {
      Admin: { status: "Assigned to Admin" },
      Manager: { status: "Assigned to Manager" },
      TeamLead: { status: "Assigned to TeamLead" },
      Expert: { status: "Running" },
    };
    var updatestatus = await Status.findByIdAndUpdate(
      updatecomm.taskid,
      {
        status: status[assignedtodetails.employee.user_role].status,
      },
      { new: true }
    );
    await sendNotificationForComm(
      "taskCommStatus",
      { user: assignedtodetails, comm: updatecomm },
      req
    );
    res.status(200).send({ updatecomm, updatestatus });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//list of all people involve in the task
exports.get_people_task = async (req, res, next) => {
  try {
    var list_id = [];
    var singlecomm1 = await Comm.aggregate([
      { $match: { taskid: req.params.taskid } },

      {
        $project: {
          _id: 0,
          assignedto: "$tasklogs.assignedto",
        },
      },
      { $unwind: "$assignedto" },
      { $group: { _id: "$assignedto" } },
    ]);
    var singlecomm2 = await Comm.aggregate([
      { $match: { taskid: req.params.taskid } },

      {
        $project: {
          _id: 0,
          assignedby: "$tasklogs.assignedby",
        },
      },
      { $unwind: "$assignedby" },
      { $group: { _id: "$assignedby" } },
    ]);

    await User.populate(singlecomm1, { select: "name", path: "_id" });
    await User.populate(singlecomm2, { select: "name", path: "_id" });
    var resp = singlecomm2.concat(singlecomm1);
    var response = [];
    resp.filter((i) => {
      if (
        response.findIndex((x) => String(x._id._id) === String(i._id._id)) ===
        -1
      ) {
        return response.push(i);
      }
    });
    // var singlecomm2 = await Comm.findOne({
    //   taskid: req.params.taskid
    // }).distinct("tasklogs.assignedto");
    // //list_id.push({ singlecomm2 }, { singlecomm1 });
    // // await User.populate(list_id[0].singlecomm1, {path : "singlecomm1"})
    // for(i=0;i<singlecomm1.length;i++){
    //   list_id.push(singlecomm1[i])
    // }
    // for(j=0;j<singlecomm2.length;j++){
    //   list_id.push(singlecomm2[j])
    // }
    // var populateddata = await populatedata(list_id)
    res.status(200).send(response);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};
async function populatedata(data) {
  var pop = [];
  var lengthofarray = data.length;
  for (i = 0; i <= lengthofarray; i++) {
    var data1 = await User.findById(data[i]);
    pop.push(data1);
  }
  return pop;
}
