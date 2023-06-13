const User = require('../models/user');
const Task = require('../models/task');
const axios = require('axios');

exports.get_ex_dashboard = (req, res, next) => {
  res.render('expert/dashboard', {
    pageTitle: 'Expert | Dashboard',
  });
};

exports.get_ex_contentcreator = (req, res, next) => {
  res.render('expert/answers', {
    pageTitle: 'Expert | Content Creation',
  });
};

exports.get_ex_notifications = (req, res, next) => {
  res.render('expert/notifications', {
    pageTitle: 'Ex | Notifications',
  });
};

exports.get_ex_task = (req, res, next) => {
  res.render('expert/task', {
    pageTitle: 'Expert | Task List',
  });
};

exports.get_ex_alltask = (req, res, next) => {
  res.render('expert/alltask', {
    pageTitle: 'Expert | All Task List',
  });
};

exports.get_ex_profile = (req, res, next) => {
  res.render('expert/profile', {
    pageTitle: 'Expert | Profile',
  });
};

exports.get_incentivecalc = (req, res, next) => {
  res.render('expert/calculator', {
    pageTitle: 'Expert | Incentive Calc',
  });
};

exports.get_effortsheet = (req, res, next) => {
  res.render('expert/effortsheet', {
    pageTitle: 'Expert | Effort Sheet',
  });
};

exports.get_ex_singletask = (req, res, next) => {
  res.render('expert/singletask', {
    pageTitle: req.params.taskid,
  });
};
