const express = require('express')
const router = express.Router()
const {Group } = require('../sequelize')

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
router.get('/',(req,res)=>{
    Group.findAll()
        .then((groups)=>{
            if (groups){
                return successPromise(res,groups,'success')
            }else {
                throw error;
            }
        })
        .catch((error)=>{
            return failurePromise(res,error,'','failure')    
    })        
})
// get group by id
router.get('/:id',(req,res, next)=>{
    const Id= req.params.id;
    if(!Id){
        return failurePromise(res,'request not valid', '400','failure')
    }else{
        Group.findAll({where: {id: Id}}).then((group)=>{
            return successPromise(res,group,'200','success');
        }).catch((err)=>{
            return failurePromise(res,err.errors,'500','failure')
        })
    }    
});


router.put('/:id', (req,res)=>{
    const Id= req.params.id;
    const groupName= req.body.groupName;
    if (!Id ){
        return failurePromise(res,'request not valid', '400','failure')
    }   
    Group.update(
        {name: groupName},
        {returning: true, where: {id: Id }}
    )
    .then((group) => {
        return successPromise(res,group[1],'200','Record updated successfully');
    }).catch((error)=>{
        return failurePromise(res,error.errors,'500','failure');
    })
})

router.delete('/:id', (req,res)=>{
    const Id= req.params.id;
    if (!Id ){
        return failurePromise(res,'request not valid', '400','failure')
    }   
    Group.destroy(
        {returning: true, where: {id: Id }}
    )
    .then((group) => {
        const data= group + " Record deleted"
        return successPromise(res,data,'200','success');
    }).catch((error)=>{
        return failurePromise(res,error,'500','failure');
    })
})
// Building a non-persistent instance
router.post('/',(req, res, next)=>{
    if(!req.body.groupName){
        return failurePromise(res,'please provide group name', '400','failure')
    }else{
        Group.create({ name: req.body.groupName }, { fields: [ 'name' ] }).then((group)=> {
            return successPromise(res,group,'200','New Group Successfully Added');
          }).catch((err)=>{
            return failurePromise(res,err.errors,'500','failure')
        })
    }
})
// Building a non-persistent instance
router.post('/addgroup',(req, res, next)=>{
    if(!req.body.groupName){
        return failurePromise(res,'please provide group name','400','failure');
    }else{
        Group.build({name: req.body.groupName})
        .save()
        .then((group)=> {
            return successPromise(res, group,'200', 'New Group Successfully Added');
        })
        .catch((error)=> {
            return failurePromise(res, error.errors,'500', 'failure');   
        })
    }
})
module.exports = router;