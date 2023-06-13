const express = require("express");
const router = express.Router();

const adminController = require("../../controller/manager/task");

router.get("/delayed", adminController.get_delayed_task)
router.get("/current", adminController.get_teamlead_task_list);
router.get("/all", adminController.get_all_task);
router.get("/filter", adminController.get_task_ultimate);
router.get("/view/:taskid", adminController.get_mn_single_task)
module.exports = router;