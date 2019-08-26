const express = require('express')
const router = express.Router()
const db = require('../sequelize')

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
exports.getAllcustomer = (req, res, next)=>{
    db.customers.findAll({where: 
        {is_deleted:0}
    })        
    .then((customers)=>{
            if (customers){
                return successPromise(res,customers,'success')
            }else {
                throw error;
            }
    })
    .catch((error)=>{
        return failurePromise(res,error,'500','failure')    
    })        
}
exports.createCustomer = (req, res, next)=>{
    const {customerId, customerName, status} = req.body;
    if(!customerId && !customerName && !status){
        return failurePromise(res,'required field ', '400','failure')
    }else{
        db.customers.create({ customer_id:customerId, customer_name:customerName, status }, { fields: [ 'customer_id', 'customer_name','status'] })
        .then((customer)=> {
            return successPromise(res,customer,'200','User Successfully Added');
          }).catch((err)=>{
             return failurePromise(res,err,'500','failure')
        })
    }
}
exports.getOneCustomer = (req,res, next)=>{
    const customerId= req.params.customerId;
    if(!customerId){
        return failurePromise(res,'Request not valid', '400','failure')
    }else{
        db.customers.findAll({where: {customer_id: customerId} ,$and:[
            {is_deleted:{$eq:0}}
        ]
         })
        .then((customer)=>{
            return successPromise(res,customer,'success');
        }).catch((err)=>{
            console.log(err)
            return failurePromise(res,err.errors,'500','failure')
        })
    }    
}

exports.searchCustomer = (req, res, next)=> {
    const data= req.params.term.trim();
    db.customers.findAll({where: {
                        $or:[
                            {   customer_id: {
                                $iLike:'%'+data+'%'
                            }},
                            {   customer_name: {
                                $iLike:'%'+data+'%'
                            }}
                        ],
                        $and:[
                            {is_deleted:{$eq:0}}
                        ]
                        }           
                    })
    .then((customer)=>{
        return successPromise(res,customer,'200','success');
    }).catch((err)=>{
        return failurePromise(res,err,'500','failure')
    })
}
exports.updateCustomer = (req,res)=>{
    const customerId= req.params.customerId;
    const customerName= req.body.customerName;
    const status= req.body.status;
    const userId= req.body.userId;
    if (!customerId ){
        return failurePromise(res,'Request not valid', '400','failure')
    } 
    db.customers.update(
        { customer_name:customerName,status: status},
        {returning: true, where: {customer_id: customerId }}
    )
    .then((customer) => {
        return successPromise(res,customer[1],'200','Record updated successfully');
    }).catch((error)=>{
        return failurePromise(res,error.errors,'500','failure');
    })
}

exports.deleteCustomer = (req,res)=>{
    const customerId= req.params.customerId;
    if (!customerId ){
        return failurePromise(res,'Request not valid', '400','failure')
    }   
    db.customers.update(
        { is_deleted:1},
        {returning: true, where: {customer_id: customerId }}
    )
    .then((customer) => {
        const data= customer[1] + " Record deleted"
        return successPromise(res,data,'200','success');
    }).catch((error)=>{
        return failurePromise(res,error,'500','failure');
    })
}