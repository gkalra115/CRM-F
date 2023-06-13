const express = require('express');
const router = express.Router();

const notificationsController = require('../controller/notifications');

const { checkAuth } = require('../middleware/check-auth');

router.put(
  '/notifications/read',
  checkAuth,
  notificationsController.put_read_notification
);
router.put(
  '/notifications/unread',
  checkAuth,
  notificationsController.put_unread_notification
);
router.get(
  '/notifications/all',
  checkAuth,
  notificationsController.get_all_notification
);
router.put(
  '/notifications/starred',
  checkAuth,
  notificationsController.put_starred_notification
);

module.exports = router;
