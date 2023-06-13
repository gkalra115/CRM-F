//importing models from schema
const User = require('../../models/user');

//importing other installed libraries
const bcrypt = require('bcrypt');
var generator = require('generate-password');
const mongoose = require('mongoose');
const nodemailer = require('../../util/nodemailer');

const Task = require('../../models/task');

const ObjectId = mongoose.Types.ObjectId;

//get employee stats
exports.get_mn_stats = async (req, res, next) => {
  try {
    var alltask = await Task.aggregate([
      {
        $lookup: {
          from: 'comms',
          localField: 'taskcomm',
          foreignField: '_id',
          as: 'comm',
        },
      },
      { $unwind: '$comm' },
      {
        $match: {
          deleted: { $eq: false },
        },
      },
      {
        $project: {
          title: 1,
          wordcount: 1,
          deadline: '$soft_deadline',
          status: '$status.status',
          admin: '$comm.Admin',
          manager: '$comm.Manager',
        },
      },
      {
        $match: {
          manager: req.decoded.userId,
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$wordcount' },
          count: { $sum: 1 },
        },
      },
    ]);
    res.send(alltask);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

//view single profile
exports.get_mn_profile = async (req, res, next) => {
  try {
    var singleemployee = await User.findById(req.decoded.userId);
    await User.populate(singleemployee, { select: 'name', path: 'assignedTo' });
    res.status(200).send(singleemployee);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view all employee
exports.get_employee_all = async (req, res, next) => {
  try {
    // console.log(req.decoded.userId);
    var allemployee = await User.aggregate([
      { $match: { _id: ObjectId(req.decoded.userId) } },
      {
        $graphLookup: {
          from: 'users',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'assignedTo',
          as: 'team',
        },
      },
      {
        $unwind: '$team',
      },
      { $match: { 'team.user_type': 'Employee', 'team.is_active': true } },
      {
        $project: {
          is_active: '$team.is_active',
          email: '$team.email',
          name: '$team.name',
          phone: '$team.phone',
          user_type: '$team.user_type',
          employee: '$team.employee',
          assignedTo: '$team.assignedTo',
          employee: '$team.employee',
        },
      },
    ]);
    res.status(200).send({
      status: 'OK',
      data: allemployee,
    });
  } catch (e) {
    console.log(e);
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

exports.get_employee_tree = async (req, res, next) => {
  var user_id = req.query.parent;
  const user = await User.aggregate([
    { $match: { _id: ObjectId(user_id) } },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'assignedTo',
        as: 'team',
      },
    },
    { $unwind: '$team' },
    {
      $project: {
        _id: 0,
        id: '$team._id',
        // "icon" : "fa fa-user icon-lg kt-font-success",
        icon: {
          $switch: {
            branches: [
              {
                case: { $eq: ['$team.employee.user_role', 'SuperAdmin'] },
                then: 'fa fa-user icon-lg',
              },
              {
                case: { $eq: ['$team.employee.user_role', 'Admin'] },
                then: 'fa fa-user icon-lg kt-font-danger',
              },
              {
                case: { $eq: ['$team.employee.user_role', 'Manager'] },
                then: 'fa fa-user icon-lg kt-font-warning',
              },
              {
                case: { $eq: ['$team.employee.user_role', 'TeamLead'] },
                then: 'fa fa-user icon-lg kt-font-success',
              },
            ],
            default: 'fa fa-user icon-lg kt-font-brand',
          },
        },
        text: {
          $concat: ['$team.name', ' [', '$team.employee.user_role', ']'],
        },
        // "children" : {$toBool: ""},
        children: {
          $cond: {
            if: { $eq: ['$team.employee.user_role', 'Expert'] },
            then: false,
            else: true,
          },
        },
        user_type: '$team.user_type',
      },
    },
    { $match: { user_type: 'Employee' } },
  ]);
  //  const result = await User.populate(user, {path: 'team.assignedTo'})
  res.send(user);
};

exports.get_employee_getTeam = async (req, res, next) => {
  try {
    const userTeam = await User.aggregate([
      { $match: { _id: ObjectId(req.decoded.userId), is_active: true } },
      {
        $graphLookup: {
          from: 'users',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'assignedTo',
          as: 'team',
        },
      },
      { $unwind: '$team' },
      { $match: { 'team.user_type': 'Employee', 'team.is_active': true } },
      {
        $project: {
          _id: 0,
          id: '$team._id',
          name: '$team.name',
          role: '$team.employee.user_role',
          parent: '$team.assignedTo',
        },
      },
    ]);
    await User.populate(userTeam, {
      select: 'name employee.user_role',
      path: 'parent',
    });
    res.send(userTeam);
  } catch (error) {
    next(error);
  }
};

exports.get_employee_assignTo = async (req, res, next) => {
  const userRoleChange = {
    Admin: 'SuperAdmin',
    Manager: 'Admin',
    TeamLead: 'Manager',
    Expert: 'TeamLead',
  };
  try {
    const { role, id } = req.query;
    const user = await User.find(
      {
        _id: { $ne: id },
        user_type: 'Employee',
        'employee.user_role': userRoleChange[role],
      },
      {
        name: 1,
        employee: 1,
        email: 1,
      }
    );
    res.send({
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.post_employee_mail = (req, res, next) => {
  let type = req.body.type;
  let msg = req.body.message;
  let html;
  if (type === "warning") {
    html = `
    <html>
      <head>
        <title>Test Title</title>
        <style>
          footer {
            font-weight: light !important;
            color: #bdc3c7;
            font-size: 10px;
          }
          #message {
            margin: 2vw 0vw;
            font-size: 12px;
            color: #E67E22;
            text-align: center;
            opacity: 0.7;
            font-weight: 600 !important;
          }
          #type {
            text-align: center;
            font-size: 25px;
            border-bottom: 2px solid #E67E22;
            color: #E67E22;
            padding: 10px 0px;
          }
        </style>
      </head>
      <body>
        <div id="type">${type}</div>
        <div id="message">${msg}</div>
        <footer>
          <p>
            Lorem ut posuere nibh imperdiet ac. Nunc euismod turpis nec ligula
            viverra cursus. Integer ut faucibus leo, et sodales lacus. Aliquam
            luctus et dolor eget congue. Duis sodales nunc felis, a pulvinar justo
            interdum eu. Nam finibus rutrum ipsum sed tristique. Curabitur nibh
            lacus, congue sit amet nulla et, aliquam sollicitudin nulla.
            Pellentesque nec tempor metus. Fusce nulla velit, congue id convallis
            sed, facilisis 
          </p>
        </footer>
      </body>
    </html>
  `;
  } else if (type === "termination") {
    html = `
    <html>
      <head>
        <title>Test Title</title>
        <style>
          footer {
            font-weight: light !important;
            color: #bdc3c7;
            font-size: 10px;
          }
          #message {
            margin: 2vw 0vw;
            font-size: 12px;
            color: #e74c3c;
            text-align: center;
            opacity: 0.7;
            font-weight: 600 !important;
          }
          #type {
            text-align: center;
            font-size: 25px;
            border-bottom: 2px solid #e74c3c;
            color: #e74c3c;
            padding: 10px 0px;
          }
        </style>
      </head>
      <body>
        <div id="type">${type}</div>
        <div id="message">${msg}</div>
        <footer>
          <p>
            Lorem ut posuere nibh imperdiet ac. Nunc euismod turpis nec ligula
            viverra cursus. Integer ut faucibus leo, et sodales lacus. Aliquam
            luctus et dolor eget congue. Duis sodales nunc felis, a pulvinar justo
            interdum eu. Nam finibus rutrum ipsum sed tristique. Curabitur nibh
            lacus, congue sit amet nulla et, aliquam sollicitudin nulla.
            Pellentesque nec tempor metus. Fusce nulla velit, congue id convallis
            sed, facilisis 
          </p>
        </footer>
      </body>
    </html>
  `;
  } else {
    html = `
    <html>
      <head>
        <title>Test Title</title>
        <style>
          footer {
            font-weight: light !important;
            color: #bdc3c7;
            font-size: 10px;
          }
          #message {
            margin: 2vw 0vw;
            font-size: 12px;
            color: #2c3e50;
            text-align: center;
            opacity: 0.7;
            font-weight: 600 !important;
          }
          #type {
            text-align: center;
            font-size: 25px;
            border-bottom: 2px solid #2c3e50;
            color: #2c3e50;
            padding: 10px 0px;
          }
        </style>
      </head>
      <body>
        <div id="type">${type}</div>
        <div id="message">${msg}</div>
        <footer>
          <p>
            Lorem ut posuere nibh imperdiet ac. Nunc euismod turpis nec ligula
            viverra cursus. Integer ut faucibus leo, et sodales lacus. Aliquam
            luctus et dolor eget congue. Duis sodales nunc felis, a pulvinar justo
            interdum eu. Nam finibus rutrum ipsum sed tristique. Curabitur nibh
            lacus, congue sit amet nulla et, aliquam sollicitudin nulla.
            Pellentesque nec tempor metus. Fusce nulla velit, congue id convallis
            sed, facilisis 
          </p>
        </footer>
      </body>
    </html>
  `;
  }
  let mailOptions = {
    from: 'squalosolutions@gmail.com',
    to: req.body.email,
    subject: req.body.subject,
    html: html
  };

  nodemailer
    .wrapedSendMail(mailOptions)
    .then(() => {
      res.json({
        mailStatus: 'Mail has been sent',
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

//hard delete employee
// exports.delete_employee_hard = async (req, res, next) => {
//   try {
//     var deleteuser = await User.findByIdAndRemove(req.params.id);
//     res.status(200).send('User Deleted permanently');
//   } catch (e) {
//     res.status(400).send({ error: e.errmsg });
//   }
// };

//soft delete employee
// exports.delete_employee_soft = async (req, res, next) => {
//   try {
//     var deleteuser = await User.findByIdAndUpdate(req.params.id, {
//       is_active: false,
//     });
//     res.status(200).send('User Deleted');
//   } catch (e) {
//     res.status(400).send({ error: e.errmsg });
//   }
// };
