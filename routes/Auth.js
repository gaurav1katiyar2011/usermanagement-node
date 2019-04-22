const express = require('express')
const router = express.Router()
const db = require('../sequelize')

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
// Building a non-persistent instance
router.post('/',(req, res, next)=>{
    userId= req.body.userId
    password= req.body.password
    if(!userId && !password){
        return failurePromise(res,'Not valid user', '400','failure')
    }else{
        db.users.findAll({where: {user_id: userId, password: password},include: [
            {
              model: db.groups ,
              include: [{model: db.tabs}]
            }
          ]
        }).then((auth)=> {
            if (auth.length>0){
                return successPromise(res,auth,'200','Authenticated Successfully');
            }else {
                return failurePromise(res,auth,'400','failure')    
            }
          }).catch((err)=>{
            return failurePromise(res,err.errors,'500','failure')
        })
    }
})

module.exports = router;