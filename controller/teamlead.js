const User = require('../models/user');
const Task = require('../models/task');
const axios = require('axios');

exports.get_tl_dashboard = (req, res, next) => {
  res.render('teamlead/dashboard', {
    pageTitle: 'TeamLead | Dashboard',
  });
};

exports.get_tl_notifications = (req, res, next) => {
  res.render('teamlead/notifications', {
    pageTitle: 'TeamLead | Notifications',
  });
};

exports.get_tl_profile = (req, res, next) => {
  res.render('teamlead/profile', {
    pageTitle: 'TeamLead | Profile',
  });
};

exports.get_tl_singletask = (req, res, next) => {
  res.render('teamlead/singletask', {
    pageTitle: req.params.taskid,
  });
};

exports.get_tl_task = (req, res, next) => {
  res.render('teamlead/task', {
    pageTitle: 'TeamLead | Task List',
  });
};

exports.get_tl_effort = (req, res, next) => {
  res.render('teamlead/effortsheet', {
    pageTitle: 'TeamLead | Effort List',
  });
};

exports.get_tl_alltask = (req, res, next) => {
  res.render('teamlead/alltask', {
    pageTitle: 'TeamLead | All Task List',
  });
};

exports.get_tl_sample = async (req, res, next) => {
  res.render('teamlead/sample', {
    pageTitle: 'TL | Samples',
  });
};

exports.get_tl_answers = async (req, res, next) => {
  res.render('teamlead/answers', {
    pageTitle: 'TL | Content generator',
  });
};
