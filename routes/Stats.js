const express = require('express');
const router = express.Router();
const db = require('../sequelize')

router.get('/', function(req,res){
    Promise.all([
        db.users.count(),
        db.groups.count()
    ]).then(results=>{
        const [users, groups] = results;
        return res.status(200).json({
            code: 200,
            users,
            groups: groups
        })
    }).catch(err=>{
        return res.status(500).json({
            code: 500,
            error: err
        })
    })
});

module.exports = router;
