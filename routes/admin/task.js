const express = require("express");
const router = express.Router();

const adminController = require("../../controller/admin/task");

router.post("/create", adminController.post_task_create);
router.get('/sales', adminController.get_sales_records)
router.get("/view", adminController.get_task_week); // view task within deadline of one week with status not equal to delivered, completed.
router.get("/filter", adminController.get_task_ultimate); // view task within deadline of one week with status not equal to delivered, completed.
router.get("/alltask", adminController.get_task_all); // view all task with status not equal to delivered, completed.
router.get("/progress", adminController.get_task_progress); // view all task which are in progress.
router.get("/payment/task", adminController.get_payment_status_task); // payment sheet with status, client
router.get("/payment/client", adminController.get_payment_client); //payment according to client
router.get("/unassigned", adminController.get_task_unassigned); // view all task which are unassigned.
router.get("/full", adminController.get_task_full); // view all task
router.get("/delayed", adminController.get_task_delayed); // view task whose deadline has passed away
router.get("/client/:clientid", adminController.get_task_client); // view task of particular client
router.get("/test", adminController.test)
router.get("/:id", adminController.get_task_single);
router.put("/:id", adminController.put_task_update);
router.delete("/hard/:id", adminController.delete_task_hard);
router.delete("/:id", adminController.delete_task_soft);

module.exports = router;