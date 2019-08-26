const express = require('express')
const router = express.Router()
const db = require('../sequelize')
const Group = require('../controller/group')

// Get all group list
const successPromise = (resObj,result,message)=>{
    resObj.status(200).json({
        code:200,
        message: message,
        data: result
    })
}
const failurePromise = (resObj,error,code,message)=>{
    resObj.status(code).json({
        code: code,
        message: message,
        error: error
    })
}
router.get('/',Group.getAllGroup);
router.get('/:id',Group.getOneGroup);
router.get('/search/:term', Group.searchGroup);
router.put('/:id', Group.updateGroup);
router.delete('/:id', Group.deleteGroup)
// Building a non-persistent instance
router.post('/',Group.createGroup);
module.exports = router;