//importing models from schema
const User = require("../../models/user");
const { validationResult } = require('express-validator');

//importing other installed libraries
const bcrypt = require("bcrypt");
var generator = require("generate-password");
const mongoose = require('mongoose');

const ObjectId = mongoose.Types.ObjectId;

//create employee
exports.post_create_employee = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    res.json({
      msg: 'error',
      errors
    });
  }
  var password = await generator.generate({
    length: 10,
    numbers: true
  });
  var decryptedpass = await bcrypt.hash(password, 10);
  const employee = new User({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    user_type: "Employee",
    is_active: req.body.is_active,
    password: decryptedpass,
    originalpass: password,
    employee: {
      salary: req.body.salary,
      joiningDate: req.body.joiningDate,
      user_role: req.body.user_role
    },
    assignedTo: req.decoded.userId,
    createdby: req.decoded.userId
  });

  try {
    var employeesaved = await employee.save();
    res.status(201).send({
      status: "created",
      data: employeesaved
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view all employee
exports.get_employee_all = async (req, res, next) => {
  try {
    var allemployee = await User.aggregate([
      { $match: { _id: ObjectId(req.decoded.userId) } },
      {
        $graphLookup: {
          from: "users",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "assignedTo",
          as: "team"
        }
      },
      { $match: { "team.user_type": "Employee" } },
      {
        $project: {
          "team._id": 1,
          "team.is_active": 1,
          "team.email": 1,
          "team.name": 1,
          "team.phone": 1,
          "team.user_type": 1,
          "team.employee": 1,
          "team.assignedTo": 1,
        }
      }
    ]);
    console.log(allemployee[0].team);
    res.status(200).send({
      status: "OK",
      data: allemployee[0].team
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view single employee details
exports.get_employee_single = async (req, res, next) => {
  try {
    var singleemployee = await User.findById(req.params.id);
    res.status(200).send(singleemployee);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//update employee details
exports.put_employee_update = async (req, res, next) => {
  try {
    var updateemployee = await User.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        user_type: "Employee",
        is_active: req.body.is_active === "true",
        employee: {
          salary: req.body.salary,
          joiningDate: req.body.joiningDate,
          user_role: req.body.user_role,
          endDate: req.body.endDate
        }
      },
      { new: true }
    );
    res.status(200).send(updateemployee);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.get_employee_tree = async (req, res, next) => {
  var user_id = req.query.parent;
  const user = await User.aggregate([
    { $match: { "_id": ObjectId(user_id) } },
    {
      $lookup:
      {
        from: "users",
        localField: "_id",
        foreignField: "assignedTo",
        as: "team"
      }
    },
    { $unwind: "$team" },
    {
      $project:
      {
        "_id": 0,
        "id": "$team._id",
        // "icon" : "fa fa-user icon-lg kt-font-success",
        "icon": {
          $switch: {
            branches: [
              { case: { $eq: ["$team.employee.user_role", "SuperAdmin"] }, then: "fa fa-user icon-lg" },
              { case: { $eq: ["$team.employee.user_role", "Admin"] }, then: "fa fa-user icon-lg kt-font-danger" },
              { case: { $eq: ["$team.employee.user_role", "Manager"] }, then: "fa fa-user icon-lg kt-font-warning" },
              { case: { $eq: ["$team.employee.user_role", "TeamLead"] }, then: "fa fa-user icon-lg kt-font-success" }
            ],
            default: "fa fa-user icon-lg kt-font-brand"
          }
        },
        "text": { $concat: ["$team.name", " [", "$team.employee.user_role", "]"], },
        // "children" : {$toBool: ""},
        "children": {
          $cond: {
            if: { $eq: ["$team.employee.user_role", "Expert"] },
            then: false,
            else: true
          }
        },
        "user_type": "$team.user_type"
      }
    },
    { $match: { "user_type": "Employee" } }
  ]);
  //  const result = await User.populate(user, {path: 'team.assignedTo'})
  res.send(user);
};

exports.get_employee_getTeam = async (req, res, next) => {
  try {
    const userTeam = await User.aggregate([
      { $match: { _id: ObjectId(req.decoded.userId) }, is_active: true },
      {
        $graphLookup: {
          from: "users",
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "assignedTo",
          as: "team"
        }
      },
      { $unwind: "$team" },
      { $match: { "team.user_type": "Employee", 'team.is_active': true } },
      {
        $project: {
          "_id": 0,
          "id": "$team._id",
          "name": "$team.name",
          "role": "$team.employee.user_role",
          "parent": "$team.assignedTo"
        }
      }
    ]);
    await User.populate(userTeam, { select: "name employee.user_role", path: "parent" });
    res.send(userTeam);
  } catch (error) {
    next(error);
  }
};

exports.post_employee_assignTo = async (req, res, next) => {
  try {
    const userRoleChange = {
      "Admin": "SuperAdmin",
      "Manager": "Admin",
      "TeamLead": "Manager",
      "Expert": "TeamLead"
    };
    const user = await User.findById(req.body.id, {
      name: 1,
      email: 1,
      "employee.user_role": 1
    }).populate({ path: "assignedTo" });
    const getAboveHierarchy = await User.find(
      {
        "employee.user_role": userRoleChange[user.employee.user_role],
        _id: { $ne: user.assignedTo._id }
      },
      {
        name: 1,
        email: 1,
        "employee.user_role": 1
      }
    );
    res.send({
      user,
      getAboveHierarchy
    });
  } catch (error) {
    next(error);
  }
};

exports.get_employee_assignTo = async (req, res, next) => {
  const userRoleChange = {
    "Admin": "SuperAdmin",
    "Manager": "Admin",
    "TeamLead": "Manager",
    "Expert": "TeamLead"
  };
  try {
    const { role, id } = req.query;
    const user = await User.find({
      _id: { $ne: id },
      user_type: "Employee",
      "employee.user_role": userRoleChange[role],
    }, {
      name: 1,
      employee: 1,
      email: 1
    });
    res.send({
      user
    });
  } catch (error) {
    next(error);
  }
};

exports.put_employee_assignTo = async (req, res, next) => {
  const { userId, assignToId, assignNewRole } = req.body;
  let params = { 'assignedTo': assignToId };
  if (assignNewRole !== undefined && assignNewRole !== '') {
    const newRoleUserCheck = await User.find({
      assignedTo: userId,
      user_type: "Employee"
    }).count();
    if (newRoleUserCheck > 0) {
      return res.send({
        msg: "Need to remove the users from Hierarchy."
      });
    }
    params = Object.assign(params, { "$set": { "employee.user_role": assignNewRole } });

  }
  // next()
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, params);
    res.send({
      result: "OK",
      msg: "User reassigned Successfully"
    });
  } catch (error) {
    next(error);
  }
};

//hard delete employee
exports.delete_employee_hard = async (req, res, next) => {
  try {
    var deleteuser = await User.findByIdAndRemove(req.params.id);
    res.status(200).send("User Deleted permanently");
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//soft delete employee
exports.delete_employee_soft = async (req, res, next) => {
  try {
    var deleteuser = await User.findByIdAndUpdate(req.params.id, {
      is_active: false
    });
    res.status(200).send("User Deleted");
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};
