const express = require("express");
const router = express.Router();

const task_controller = require("../../controller/expert/task");

router.get("/current", task_controller.get_expert_task_list);
router.get("/all", task_controller.get_all_task)
router.get("/single/:taskid", task_controller.get_expert_single_task)
router.put("/status/:id", task_controller.put_status_update)
router.get("/delayed", task_controller.get_delayed_task)
router.get("/stats", task_controller.get_ex_stats)
router.get("/cprofile", task_controller.get_ex_profile)
router.post("/incalc", task_controller.get_incentivecalc)
router.get("/all", task_controller.get_all_task)
router.post("/effortsheet", task_controller.post_efforttask)
router.get("/listeffort", task_controller.get_all_effort)
router.get("/validate/:taskid", task_controller.validate_task)

module.exports = router;