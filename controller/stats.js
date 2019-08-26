const express = require('express');
const db = require('../sequelize')

exports.getStats = (req,res, next)=>{
    Promise.all([
        db.users.count(),
        db.groups.count(),
        db.customers.count()
    ]).then(results=>{
        const [users, groups,customers] = results;
        return res.status(200).json({
            code: 200,
            users,
            groups: groups,
            customers
        })
    }).catch(err=>{
        return res.status(500).json({
            code: 500,
            error: err
        })
    })
}
