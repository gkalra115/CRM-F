const express = require('express');
const router = express.Router();

const expertController = require('../controller/expert');

const { checkAuth } = require('../middleware/check-auth');

router.get('/dashboard', checkAuth, expertController.get_ex_dashboard);
router.get('/content', checkAuth, expertController.get_ex_contentcreator);
router.get('/notifications', checkAuth, expertController.get_ex_notifications);
router.get('/task', checkAuth, expertController.get_ex_task);
router.get('/all', checkAuth, expertController.get_ex_alltask);
router.get('/profile', checkAuth, expertController.get_ex_profile);
router.get('/incalc', checkAuth, expertController.get_incentivecalc);
router.get('/effortsheet', checkAuth, expertController.get_effortsheet);
router.get('/view/:taskid', checkAuth, expertController.get_ex_singletask);


module.exports = router;
