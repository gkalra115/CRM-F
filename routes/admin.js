const express = require('express');

const router = express.Router();

const { checkAuth } = require('../middleware/check-auth');

const adminController = require('../controller/admin');

router.get('/dashboard', checkAuth, adminController.get_ad_dashboard);
router.get('/notifications', checkAuth, adminController.get_ad_notifications);
router.get('/clients', checkAuth, adminController.get_ad_clients);
router.get('/clients/:id', checkAuth, adminController.get_ad_single_client);
router.get('/task', checkAuth, adminController.get_ad_task);
router.get('/task/:id', checkAuth, adminController.get_ad_task_single);
router.get('/employees', checkAuth, adminController.get_ad_employee);
router.get('/team', checkAuth, adminController.get_ad_team);

module.exports = router;
