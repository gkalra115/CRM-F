const User = require('../models/user');
const Task = require('../models/task');
exports.get_bd_dashboard = async (req, res, next) => {
  res.render('bdm/dashboard', {
    pageTitle: 'BDM | Dashboard',
    pageLink: true,
  });
};
exports.get_bd_transactions = async (req, res, next) => {
  res.render('bdm/transactionsheet', {
    pageTitle: 'BDM | Transactions',
    pageLink: true,
  });
};
exports.get_bd_clients = async (req, res, next) => {
  res.render('bdm/clients', {
    pageTitle: 'BDM | Clients',
  });
};
exports.get_bd_task_single = (req, res, next) => {
  res.render('bdm/singletask', {
    pageTitle: req.params.id,
  });
};

exports.get_bd_single_client = (req, res, next) => {
  res.render('bdm/clientsingle', {
    pageTitle: req.params.id,
    pageLink: true,
  });
};
exports.get_bd_task = async (req, res, next) => {
  res.render('bdm/task', {
    pageTitle: 'BDM | Task List',
  });
};

exports.get_bd_notifications = (req, res, next) => {
  res.render('bdm/notifications', {
    pageTitle: 'BDM | Notifications',
  });
};

exports.get_financial_records = async (req, res, next) => {
  if (req.query.month == null) {
    var financevalue = await Task.aggregate([
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: '_id',
          as: 'payments',
        },
      },
      { $unwind: '$payments' },
      {
        $match: {
          deleted: false,
        },
      },
      {
        $project: {
          month: { $month: '$hard_deadline' },
          year: { $year: '$hard_deadline' },
          currency: '$payments.currency',
          paid: '$payments.amount_paid',
          budget: '$payments.budget',
        },
      },
      {
        $group: {
          _id: '$currency',
          totalamount: {
            $sum: '$budget',
          },
          totalpaid: {
            $sum: '$paid',
          },
        },
      },
    ]);
  } else {
    const month = req.query.month;
    const year = req.query.year;
    var financevalue = await Task.aggregate([
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: '_id',
          as: 'payments',
        },
      },
      { $unwind: '$payments' },
      {
        $match: {
          deleted: false,
        },
      },
      {
        $project: {
          cmonth: { $month: '$hard_deadline' },
          cyear: { $year: '$hard_deadline' },
          currency: '$payments.currency',
          paid: '$payments.amount_paid',
          budget: '$payments.budget',
        },
      },
      {
        $match: {
          cmonth: Number(month),
          cyear: Number(year),
        },
      },
      {
        $group: {
          _id: '$currency',
          totalamount: {
            $sum: '$budget',
          },
          totalpaid: {
            $sum: '$paid',
          },
        },
      },
    ]);
  }
  var lengthfinan = financevalue.length;
  var currencydata = {
    AUD: 0.021,
    GBP: 0.01,
    NZD: 0.022,
    USD: 0.014,
    INR: 1,
  };
  var sum = 0;
  var paid = 0;
  for (i = 0; i < lengthfinan; i++) {
    var inr = financevalue[i].totalamount / currencydata[financevalue[i]._id];
    var inrpaid = financevalue[i].totalpaid / currencydata[financevalue[i]._id];
    sum += inr;
    paid += inrpaid;
  }

  sum = Math.round(sum);
  paid = Math.round(paid);

  pending = sum - paid;
  res.json({ totalamount: sum, totalpaid: paid, totalpending: pending });
};

exports.get_sales_records = async (req, res, next) => {
  if (req.query.month == null) {
    var financevalue = await Task.aggregate([
      {
        $lookup: {
          from: 'status',
          localField: '_id',
          foreignField: '_id',
          as: 'status',
        },
      },
      { $unwind: '$status' },
      {
        $match: {
          deleted: false,
        },
      },
      {
        $project: {
          month: { $month: '$hard_deadline' },
          year: { $year: '$hard_deadline' },
          wordcount: 1,
          status: '$status.status',
        },
      },
      {
        $group: {
          _id: '$status',
          wordcount: {
            $sum: '$wordcount',
          },
          totaltask: { $sum: 1 },
        },
      },
    ]);
  } else {
    const month = req.query.month;
    const year = req.query.year;
    var financevalue = await Task.aggregate([
      {
        $lookup: {
          from: 'status',
          localField: '_id',
          foreignField: '_id',
          as: 'status',
        },
      },
      { $unwind: '$status' },
      {
        $match: {
          deleted: false,
        },
      },
      {
        $project: {
          month: { $month: '$hard_deadline' },
          year: { $year: '$hard_deadline' },
          wordcount: 1,
          status: '$status.status',
        },
      },
      {
        $match: {
          month: Number(month),
          year: Number(year),
        },
      },
      {
        $group: {
          _id: '$status',
          wordcount: {
            $sum: '$wordcount',
          },
          totaltask: { $sum: 1 },
        },
      },
    ]);
  }

  res.json(financevalue);
};

exports.get_bd_profile = (req, res, next) => {
  res.render('bdm/profile', {
    pageTitle: 'BDM | Profile',
  });
};

exports.get_bd_payment = (req, res, next) => {
  res.render('bdm/payment', {
    pageTitle: 'BDM | Payments',
    pageLink: true,
  });
};
