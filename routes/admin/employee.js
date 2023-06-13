const express = require("express");
const router = express.Router();
const check_auth = require('../../middleware/check-auth');
const { body } = require('express-validator');
const employee_controller = require("../../controller/admin/employee");

router.get("/assignTo", employee_controller.get_employee_assignTo);
router.get("/getTeam", employee_controller.get_employee_getTeam);
router.get("/tree", employee_controller.get_employee_tree);
router.post("/create",[
    body('email').trim().notEmpty().isEmail().withMessage('Please enter a valid email'),
    body('name')
    .notEmpty()
    .custom((value) => {
      return /^[a-zA-Z ]{2,50}$/.test(value);
    })
    .withMessage("Name : The name should be in a string"),
    body('phone').trim().notEmpty().isNumeric().withMessage('Please enter a valid mobile no.'),
    body('is_active').trim().notEmpty().withMessage('Please select a valid option'),
    body('salary').trim().notEmpty().isNumeric().withMessage('Please enter a valid number'),
    body('joiningDate').trim().notEmpty().isString().withMessage('Please enter a valid date'),
    body('user_role')
    .notEmpty()
    .isString()
    .custom((value) => {
      var options = [
        "Super Admin",
        "Admin",
        "Manager",
        "Team Lead",
        "Expert"
      ];
      if (options.indexOf(value) === -1) {
        throw new Error("User Role: This is an Invalid Option");
      }
      return true;
    })
], employee_controller.post_create_employee);
router.get("/view", employee_controller.get_employee_all);
router.get("/:id", employee_controller.get_employee_single);

router.put("/assignTo", employee_controller.put_employee_assignTo);
router.put("/:id", employee_controller.put_employee_update);
router.post("/assignTo", employee_controller.post_employee_assignTo);
router.delete("/hard/:id", employee_controller.delete_employee_hard);
router.delete("/:id", employee_controller.delete_employee_soft);

module.exports = router;