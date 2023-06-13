const express = require('express');
const router = express.Router();

const task_controller = require('../../controller/teamlead/task');

router.get('/delayed', task_controller.get_delayed_task);
router.get('/current', task_controller.get_teamlead_task_list);
router.get('/all', task_controller.get_all_task);
router.put('/status/:id', task_controller.put_status_update);
router.get('/view/:taskid', task_controller.get_tl_single_task);
router.get('/stats', task_controller.get_te_stats);
router.get('/cprofile', task_controller.get_te_profile);
router.get('/effort', task_controller.get_te_effort);
router.post('/effort', task_controller.post_te_efforttask);
router.get("/validate/:taskid", task_controller.validate_task)

module.exports = router;
