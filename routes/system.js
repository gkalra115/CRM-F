const router = require('express').Router();

const systemController = require('../controller/system');

router.put('/geolocation', systemController.put_update_geolocation);

module.exports = router;