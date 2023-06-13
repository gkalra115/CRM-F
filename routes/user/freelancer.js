const express = require("express");
const router = express.Router();
const check_auth = require('../../middleware/check-auth');

const freelancer_controller = require("../../controller/user/freelancer");

router.post("/create", freelancer_controller.post_create_freelancer);
router.get("/view", freelancer_controller.get_freelancer_all);
router.get("/:id", freelancer_controller.get_freelancer_single);
router.put("/:id", freelancer_controller.put_freelancer_update);
router.delete("/hard/:id", freelancer_controller.delete_freelancer_hard);
router.delete("/:id", freelancer_controller.delete_freelancer_soft);

module.exports = router;