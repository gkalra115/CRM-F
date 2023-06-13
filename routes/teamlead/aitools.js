const express = require('express');
const router = express.Router();

const aitools_controller = require('../../controller/teamlead/aitools');

router.post('/answers', aitools_controller.post_aitools_answers);
router.get('/tokens', aitools_controller.get_tokencount);


module.exports = router;
