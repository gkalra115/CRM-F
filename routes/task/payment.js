const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const payment_controller = require('../../controller/task/payment');

router.get('/view', payment_controller.get_payment_all);
router.get('/:id', payment_controller.get_payment_single);
router.put('/bulk', payment_controller.get_payment_bulk);
router.put(
  '/:id',
  [
    body('amount_paid')
      .trim()
      .notEmpty()
      .withMessage('Please enter amount paid'),
    body('budget')
      .notEmpty()
      .withMessage('Please enter a budget')
      .custom((value, { req }) => {
        return Number(value) >= Number(req.body.amount_paid);
      })
      .withMessage('Please enter a budget greater than amount paid'),
    body('currency').trim().notEmpty().withMessage('Please enter a currency'),
    body('approved').trim().toBoolean(),
  ],
  payment_controller.put_payment_update
);

module.exports = router;
