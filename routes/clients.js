const express = require('express')
const router = express.Router()

const clientController = require('../controller/user/client')

const {checkAuth } = require('../middleware/check-auth')

router.get('/dashboard', checkAuth, clientController.get_home_client)
router.get('/soon', checkAuth, clientController.get_comingsoon_client)
router.get('/askme', checkAuth, clientController.get_askme_client)
router.get('/code', checkAuth, clientController.get_createcode_client)
router.get('/codesummary', checkAuth, clientController.get_createcodesummary_client)
router.get('/myaccount', checkAuth, clientController.get_myaccount_client)

module.exports = router