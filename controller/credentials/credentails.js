//importing models from schema
const Credentails = require("../../models/credentails");
const ObjectId = require("mongoose").Types.ObjectId;


//create client
exports.post_create_credentials = async (req, res, next) => {
  const credentails = new Credentails({
    clientid: req.body.clientid,
    studentname: req.body.studentname,
    userid: req.body.userid,
    password: req.body.password,
    University: req.body.University
  });

  try {
    var clientsaved = await credentails.save();
    res.status(201).send({
      status: "created",
      data: clientsaved
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view all clients
exports.get_client_all = async (req, res, next) => {
  try {
    var allclients = await User.find({ $and: [ { user_type: { $eq: "Client" } } , { is_active: true } ] },{
      _id : 1,
      email:1,
      name:1,
      phone:1,
      user_type:1,
      client:1,
      assignedTo:1,
      is_active:1,
    });
    res.status(200).send({
      status: "OK",
      data: allclients
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view single client details
exports.get_client_single = async (req, res, next) => {
  try {
    var singleclient = await User.findOne({
      _id: req.params.id,
      user_type: { $eq: "Client" }
    });
    if (singleclient) {
      res.status(200).send(singleclient);
    } else {
      res.status(400).send("No Client found");
    }
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//update client details
exports.put_client_update = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.json({
        msg: "error",
        errors
      });
    }
    var updateclient = await User.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        createdby: req.decoded.userId,
        user_type: "Client",
        is_active: req.body.is_active,
        client: {
          country: req.body.country,
          university: req.body.university
        }
      },
      { new: true }
    );
    res.status(200).send(updateclient);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.get_client_finance = async (req, res, next) => {
  try {
    var clientid = req.params.clientid
    if (req.query.month == null) {
      var finance = await Task.aggregate([
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "_id",
            as: "payments"
          }
        },
        { $unwind: "$payments" },
        {
          $match: {
            $and: [
              { client: ObjectId(clientid) },
              { deleted: false }
            ]
          }
        },
        {
          $project: {
            currency: "$payments.currency",
            amount_paid: "$payments.amount_paid",
            task_budget: "$payments.budget",
            wordcount: 1,
            month: { $month: "$hard_deadline" },
            year: { $year: "$hard_deadline" }
          }
        },
        {
          $group: {
            _id: "$currency",
            totalamount: {
              $sum: "$task_budget"
            },
            totalpaid: {
              $sum: "$amount_paid"
            },
            wordcount: {
              $sum: "$wordcount"
            },
            totaltask: { $sum: 1 }
          }
        }
      ]);
    }
    else{
      const month = req.query.month;
    const year = req.query.year;
      var finance = await Task.aggregate([
        {
          $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "_id",
            as: "payments"
          }
        },
        { $unwind: "$payments" },
        {
          $match: {
            $and: [
              { client: ObjectId(clientid) },
              { deleted: false }
            ]
          }
        },
        {
          $project: {
            currency: "$payments.currency",
            amount_paid: "$payments.amount_paid",
            task_budget: "$payments.budget",
            wordcount: 1,
            month: { $month: "$hard_deadline" },
            year: { $year: "$hard_deadline" }
          }
        },
        {
          $match: {
            month: Number(month),
            year: Number(year)
          }
        },
        {
          $group: {
            _id: "$currency",
            totalamount: {
              $sum: "$task_budget"
            },
            totalpaid: {
              $sum: "$amount_paid"
            },
            wordcount: {
              $sum: "$wordcount"
            },
            totaltask: { $sum: 1 }
          }
        }
      ]);
    }
    res.send(finance);
  } catch (e) {
    console.log(e);
  }
};

//hard delete client
exports.delete_client_hard = async (req, res, next) => {
  try {
    var deleteuser = await User.findByIdAndRemove(req.params.id);
    res.status(200).send("User Deleted permanently");
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//soft delete client
exports.delete_client_soft = async (req, res, next) => {
  try {
    var deleteuser = await User.findByIdAndUpdate(req.params.id, {
      is_active: false
    });
    res.status(200).send("User Deleted");
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};
