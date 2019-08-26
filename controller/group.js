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
exports.getAllGroup = (req,res,next)=>{
    db.groups.findAll({include: [
        {
          model: db.users
        }
      ]})
        .then((groups)=>{
            if (groups){
                return successPromise(res,groups,'success')
            }else {
                throw error;
            }
        })
        .catch((error)=>{
            return failurePromise(res,error,'500','failure')    
    })        
}
// get group by id
exports.getOneGroup = (req,res, next)=>{
    const Id= req.params.id;
    if(!Id){
        return failurePromise(res,'request not valid', '400','failure')
    }else{
        db.groups.findAll({where: {id: Id}}).then((group)=>{
            return successPromise(res,group,'200','success');
        }).catch((err)=>{
            return failurePromise(res,err.errors,'500','failure')
        })
    }    
}
exports.searchGroup = (req, res, next)=>{
    db.groups.findAll({where: {name: {$iLike:'%'+req.params.term.trim()+'%'}}})
    .then((group)=>{
        return successPromise(res,group,'200','success');
    }).catch((err)=>{
        return failurePromise(res,err,'500','failure')
    })
}
exports.updateGroup = (req,res, next)=>{
    const Id= req.params.id;
    const groupName= req.body.name;
    if (!Id ){
        return failurePromise(res,'request not valid', '400','failure')
    }   
    db.groups.update(
        {name: groupName},
        {returning: true, where: {id: Id }}
    )
    .then((group) => {
        return successPromise(res,group[1],'200','Record updated successfully');
    }).catch((error)=>{
        return failurePromise(res,error.errors,'500','failure');
    })
}
exports.deleteGroup = (req,res, next)=>{
    const Id= req.params.id;
    if (!Id ){
        return failurePromise(res,'request not valid', '400','failure')
    }   
    db.groups.destroy(
        {returning: true, where: {id: Id }}
    )
    .then((group) => {
        const data= group + " Record deleted"
        return successPromise(res,data,'200','success');
    }).catch((error)=>{
        return failurePromise(res,error,'500','failure');
    })
}
// Building a non-persistent instance
exports.createGroup = (req, res, next)=>{
    if(!req.body.groupName){
        return failurePromise(res,'please provide group name', '400','failure')
    }else{
        db.groups.create({ name: req.body.groupName }, { fields: [ 'name' ] }).then((group)=> {
            return successPromise(res,group,'200','New Group Successfully Added');
          }).catch((err)=>{
            return failurePromise(res,err.errors,'500','failure')
        })
    }
}
// // Building a non-persistent instance
// router.post('/addgroup',(req, res, next)=>{
//     if(!req.body.groupName){
//         return failurePromise(res,'please provide group name','400','failure');
//     }else{
//         db.groups.build({name: req.body.groupName})
//         .save()
//         .then((group)=> {
//             return successPromise(res, group,'200', 'New Group Successfully Added');
//         })
//         .catch((error)=> {
//             return failurePromise(res, error.errors,'500', 'failure');   
//         })
//     }
// })
//module.exports = router;