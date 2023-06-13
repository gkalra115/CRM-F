const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const multer = require('multer');
const order_controller = require('../../controller/task/orders');

router.get('/view', order_controller.get_client_orders);
router.put('/reject/:id', order_controller.reject_client_order);

module.exports = router;
