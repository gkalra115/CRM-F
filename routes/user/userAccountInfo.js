const userAccountInfoController =require("../../controller/userAccountInfo")
const express = require('express')

const router = express.Router();


router.post('/create', userAccountInfoController.post_user_accountInfo)
router.get('/', userAccountInfoController.get_user_accountInfo)
router.put('/:id', userAccountInfoController.put_user_accountInfo)
router.delete('/:id', userAccountInfoController.delete_user_accountInfo)

module.exports = router;