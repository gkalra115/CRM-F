const express = require('express');

const router = express.Router();

const { checkAuth } = require('../middleware/check-auth');

const bdmController = require('../controller/bdm');

router.get('/dashboard', checkAuth, bdmController.get_bd_dashboard);
router.get('/transactions', checkAuth, bdmController.get_bd_transactions);
router.get('/notifications', checkAuth, bdmController.get_bd_notifications);
router.get('/clients', checkAuth, bdmController.get_bd_clients);
router.get('/clients/:id', checkAuth, bdmController.get_bd_single_client);
router.get('/task', checkAuth, bdmController.get_bd_task);
router.get('/task/:id', checkAuth, bdmController.get_bd_task_single);
router.get('/sales', checkAuth, bdmController.get_sales_records);
router.get('/finance', checkAuth, bdmController.get_financial_records);
router.get('/profile', checkAuth, bdmController.get_bd_profile);
router.get('/payment', checkAuth, bdmController.get_bd_payment);

module.exports = router;
