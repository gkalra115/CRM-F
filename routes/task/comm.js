const express = require("express");
const router = express.Router();

const comm_controller = require("../../controller/task/taskcomm");

router.get("/view", comm_controller.get_comm_all);
router.get("/getuser/:taskid", comm_controller.get_people_task);
router.get("/:id", comm_controller.get_comm_single);
router.put("/:id", comm_controller.put_comm_update);

module.exports = router;