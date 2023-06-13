const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { checkAuth, grantAccess } = require('../../middleware/check-auth');
const user_controller = require('../../controller/user/client');

router.post(
  '/create',
  [
    body('email')
      .notEmpty()
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('name')
      .notEmpty()
      .custom((value) => {
        return /^[a-zA-Z ]{2,50}$/.test(value);
      })
      .withMessage('Name should be in a string'),
    body('phone')
      .notEmpty()
      .isNumeric()
      .withMessage('Mobile number should be valid.'),
    body('country')
      .notEmpty()
      .isString()
      .custom((value) => {
        var options = [
          'Australia',
          'India',
          'New Zealand',
          'United States',
          'United Kingdom',
          'Canada',
        ];
        if (options.indexOf(value) === -1) {
          throw new Error('This is an Invalid Option');
        }
        return true;
      }),
    body('university')
      .notEmpty()
      .isString()
      .withMessage('The name of the university is not valid.'),
    body('is_active')
      .notEmpty()
      .withMessage('The value of the is_active is not valid.'),
  ],
  user_controller.post_create_client
);
router.get('/view', user_controller.get_client_all);
router.get('/finance/:clientid', user_controller.get_client_finance);
router.get('/:id', user_controller.get_client_single);
router.put(
  '/:id',
  [
    body('email')
      .notEmpty()
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('name')
      .notEmpty()
      .custom((value) => {
        return /^[a-zA-Z ]{2,50}$/.test(value);
      })
      .withMessage('Name : The name should be in a string'),
    body('phone')
      .notEmpty()
      .isNumeric()
      .withMessage('Phone: Mobile number should be valid.'),
    body('country')
      .notEmpty()
      .isString()
      .custom((value) => {
        var options = [
          'Australia',
          'India',
          'New Zealand',
          'United States',
          'United Kingdom',
          'Canada',
        ];
        if (options.indexOf(value) === -1) {
          throw new Error('Country: This is an Invalid Option');
        }
        return true;
      }),
    body('university')
      .notEmpty()
      .isString()
      .withMessage('University: The name of the university is not valid.'),
    body('is_active')
      .notEmpty()
      .isString()
      .withMessage('Is_Active: The value of the is_active is not valid.'),
  ],
  user_controller.put_client_update
);
router.put('/assign/:id/:empId', user_controller.assign_client_bdm);
router.delete('/hard/:id', user_controller.delete_client_hard);
router.delete('/:id', user_controller.delete_client_soft);

module.exports = router;
