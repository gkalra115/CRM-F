exports.get_mn_dashboard = async (req, res, next) => {
  res.render('manager/dashboard', {
    pageTitle: 'MN | Dashboard',
  });
};
// exports.get_mn_clients = async (req,res,next) => {
//     res.render('manager/clients', {
//         pageTitle : 'MN | Clients'
//     })
// }

exports.get_mn_profile = (req, res, next) => {
  res.render('manager/profile', {
    pageTitle: 'Manager | Profile',
  });
};

exports.get_mn_alltask = (req, res, next) => {
  res.render('manager/alltask', {
    pageTitle: 'Manager | All Task',
  });
};

exports.get_mn_task_single = (req, res, next) => {
  res.render('manager/singletask', {
    pageTitle: req.params.id,
  });
};
exports.get_mn_employee = async (req, res, next) => {
  res.render('manager/employees', {
    pageTitle: 'MN | Employees',
  });
};
exports.get_mn_team = async (req, res, next) => {
  res.render('manager/team', {
    pageTitle: 'MN | Team',
    treeViewCallId: req.decoded.userId,
  });
};
exports.get_mn_task = async (req, res, next) => {
  res.render('manager/task', {
    pageTitle: 'MN | Task List',
  });
};
exports.get_mn_notifications = async (req, res, next) => {
  res.render('manager/notifications', {
    pageTitle: 'MN | Notificatons',
  });
};
