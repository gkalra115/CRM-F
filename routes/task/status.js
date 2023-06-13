const express = require("express");
const router = express.Router();

const status_controller = require("../../controller/task/status");

router.get("/view", status_controller.get_status_all);
router.get("/:id", status_controller.get_status_single);
router.put("/:id", status_controller.put_status_update);

module.exports = router;