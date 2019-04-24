const express = require('express')
const router = express.Router()
const db = require('../sequelize')
//console.log(db)

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

router.get('/',(req,res)=>{
    db.users.findAll( {include: [{ model: db.groups,include: [{model: db.tabs}] },{model: db.customers}] })        
    .then((users)=>{
            if (users){
                return successPromise(res,users,'success')
            }else {
                
                throw error;
            }
        })
        .catch((error)=>{
            console.log("inside users")
            return failurePromise(res,error,'500','failure')    
    })        
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
router.get('/:userid',(req,res, next)=>{
    const userId= req.params.userid;
    if(!userId){
        return failurePromise(res,'request not valid', '400','failure')
    }else{
        db.users.findAll({where: {user_id: userId},include: [
            {
              model: db.groups ,
              include: [{model: db.tabs}]
            },{model: db.customers}
          ]
        }).then((user)=>{
            return successPromise(res,user,'success');
        }).catch((err)=>{
            console.log(err)
            return failurePromise(res,err.errors,'500','failure')
        })
    }    
});

router.get('/search/:term', function (req, res, next) {
    db.users.findAll({where: {
                        $or:[
                            {   username: {
                                $iLike:'%'+req.params.term.trim()+'%'
                            }},
                            {   user_id: {
                                $iLike:'%'+req.params.term.trim()+'%'
                            }}
                        ]
                        },include: [
                            {
                              model: db.groups ,
                              include: [{model: db.tabs}]
                            },
                            ,{model: db.customers}
                          ]
                    })
    .then((user)=>{
        return successPromise(res,user,'200','success');
    }).catch((err)=>{
        return failurePromise(res,err,'500','failure')
    })
});
router.put('/:userid', (req,res)=>{
    const userId= req.params.userid;
    const email= req.body.email;
    const groupId= req.body.groupId;
    const username= req.body.username;
    const password= req.body.password;
    const customerId= req.body.customerId;
    if (!userId ){
        return failurePromise(res,'request not valid', '400','failure')
    } 
    db.users.update(
        {username: username, email:email,password: password,  group_id: groupId,customer_id:customerId},
        {returning: true, where: {user_id: userId }}
    )
    .then((user) => {
        return successPromise(res,user[1],'200','Record updated successfully');
    }).catch((error)=>{
        return failurePromise(res,error.errors,'500','failure');
    })
})

router.delete('/:userid', (req,res)=>{
    const userId= req.params.userid;
    if (!userId ){
        return failurePromise(res,'request not valid', '400','failure')
    }   
    db.users.destroy(
        {returning: true, where: {user_id: userId }}
    )
    .then((user) => {
        const data= user + " Record deleted"
        return successPromise(res,data,'200','success');
    }).catch((error)=>{
        return failurePromise(res,error,'500','failure');
    })
})



module.exports = router;