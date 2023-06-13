const express = require('express');
const router = express.Router();

const teamleadController = require('../controller/teamlead');

const { checkAuth } = require('../middleware/check-auth');

router.get('/dashboard', checkAuth, teamleadController.get_tl_dashboard);
router.get(
  '/notifications',
  checkAuth,
  teamleadController.get_tl_notifications
);
router.get('/task', checkAuth, teamleadController.get_tl_task);
router.get('/effortsheet', checkAuth, teamleadController.get_tl_effort);
router.get('/aitools/answers', checkAuth, teamleadController.get_tl_answers);
router.get('/all', checkAuth, teamleadController.get_tl_alltask);
router.get('/profile', checkAuth, teamleadController.get_tl_profile);
router.get('/sample', checkAuth, teamleadController.get_tl_sample);
router.get('/view/:taskid', checkAuth, teamleadController.get_tl_singletask);
module.exports = router;
