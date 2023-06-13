const express = require("express");
const router = express.Router();

const employee_controller = require("../../controller/teamlead/employee");



router.get("/getTeam", employee_controller.get_tl_getTeam);
router.get("/stats", employee_controller.get_tl_stats);
router.get("/profile", employee_controller.get_tl_profile);
module.exports = router;

