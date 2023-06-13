exports.get_ad_dashboard = async (req, res, next) => {
  res.render('admin/dashboard', {
    pageTitle: 'AD | Dashboard',
  });
};
exports.get_ad_clients = async (req, res, next) => {
  res.render('admin/clients', {
    pageTitle: 'AD | Clients',
  });
};
exports.get_ad_task_single = (req, res, next) => {
  res.render('admin/singletask', {
    pageTitle: req.params.id,
  });
};

exports.get_ad_single_client = (req, res, next) => {
  res.render('admin/clientsingle', {
    pageTitle: req.params.clientid,
  });
};
exports.get_ad_employee = async (req, res, next) => {
  res.render('admin/employees', {
    pageTitle: 'AD | Employees',
  });
};
exports.get_ad_team = async (req, res, next) => {
  res.render('admin/team', {
    pageTitle: 'AD | Team',
    treeViewCallId: req.decoded.userId,
  });
};
exports.get_ad_task = async (req, res, next) => {
  res.render('admin/task', {
    pageTitle: 'AD | Task List',
  });
};

exports.get_ad_notifications = (req, res, next) => {
  res.render('admin/notifications', {
    pageTitle: 'AD | Notifications',
  });
};
