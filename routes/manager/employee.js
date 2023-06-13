const express = require('express');
const router = express.Router();
const check_auth = require('../../middleware/check-auth');

const employee_controller = require('../../controller/manager/employee');

router.get('/assignTo', employee_controller.get_employee_assignTo);
router.get('/stats', employee_controller.get_mn_stats);
router.get('/profile', employee_controller.get_mn_profile);
router.get('/getTeam', employee_controller.get_employee_getTeam);
router.get('/tree', employee_controller.get_employee_tree);
router.get('/view', employee_controller.get_employee_all);
router.get('/:id', employee_controller.get_employee_single);
router.post('/mail', employee_controller.post_employee_mail);

// router.delete("/hard/:id", employee_controller.delete_employee_hard);
// router.delete("/:id", employee_controller.delete_employee_soft);

module.exports = router;
