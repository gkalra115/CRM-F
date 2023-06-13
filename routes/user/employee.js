const express = require('express');
const router = express.Router();
const check_auth = require('../../middleware/check-auth');
const { body } = require('express-validator');
const employee_controller = require('../../controller/user/employee');

// router.get("/abcdefg", employee_controller.get_employee_getTestData)
router.get('/assignTo', employee_controller.get_employee_assignTo);
router.get('/getTeam', employee_controller.get_employee_getTeam);
router.get('/tree', employee_controller.get_employee_tree);
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
      .withMessage('The name should be in a string'),
    body('phone')
      .notEmpty()
      .isNumeric()
      .withMessage('Mobile number should be valid.'),
    body('salary')
      .notEmpty()
      .isNumeric()
      .withMessage('Please enter a Valid Salary number'),
    body('joiningDate')
      .notEmpty()
      .isString()
      .withMessage('Please enter a valid date.'),
    body('user_role')
      .notEmpty()
      .custom((value) => {
        var roles = [
          'SuperAdmin',
          'Admin',
          'Manager',
          'TeamLead',
          'Expert',
          'BDM',
        ];
        if (roles.indexOf(value) === -1) {
          throw new Error('Please enter a valid User Role');
        }
        return true;
      }),
  ],
  employee_controller.post_create_employee
);
router.get('/view', employee_controller.get_employee_all);
router.get('/:id', employee_controller.get_employee_single);

router.put('/assignTo', employee_controller.put_employee_assignTo);
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
      .withMessage('The name should be in a string'),
    body('phone')
      .notEmpty()
      .isNumeric()
      .withMessage('Mobile number should be valid.'),
    body('salary')
      .notEmpty()
      .isNumeric()
      .withMessage('Please enter a Valid Salary number'),
    body('joiningDate')
      .notEmpty()
      .isString()
      .withMessage('Please enter a valid date.'),
    body('user_role')
      .notEmpty()
      .custom((value) => {
        var roles = [
          'SuperAdmin',
          'Admin',
          'Manager',
          'TeamLead',
          'Expert',
          'BDM',
        ];
        if (roles.indexOf(value) === -1) {
          throw new Error('Please enter a valid User Role');
        }
        return true;
      }),
    body('is_active')
      .notEmpty()
      .custom((value) => {
        var is_active = ['true', 'false', 'Active', 'In-Active'];
        if (is_active.indexOf(value) === -1) {
          throw new Error('The value of the is_active is not valid.');
        }
        return true;
      }),
  ],
  employee_controller.put_employee_update
);
router.post('/assignTo', employee_controller.post_employee_assignTo);
router.delete('/hard/:id', employee_controller.delete_employee_hard);
router.delete('/:id', employee_controller.delete_employee_soft);

module.exports = router;
