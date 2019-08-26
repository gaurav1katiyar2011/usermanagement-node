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
    const {userId,password} = req.body;
    console.log(req.body);
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


router.post('/',(req, res, next)=>{
    const {userId, password, username, groupId,email,customerId} = req.body;
    if(!userId && !password && !username && !groupId ){
        return failurePromise(res,'required field ', '400','failure')
    }else{
        db.users.create({ username, user_id: userId, password, group_id: groupId,email,customer_id:customerId }, { fields: [ 'username', 'user_id','password','group_id','email','customer_id' ] }).then((user)=> {
            return successPromise(res,user,'200','User Successfully Added');
          }).catch((err)=>{
            return failurePromise(res,err,'500','failure')
        })
    }
})

module.exports = router;
