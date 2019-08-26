const express = require('express')
const router = express.Router()
const User = require('../controller/user')
//console.log(db)

router.get('/', User.getAllUsers);
router.post('/',User.createUser);
router.get('/:userid',User.getOneUser);
router.get('/search/:term', User.searchUser);
router.put('/:userid', User.updateUser)
router.delete('/:userid', User.deleteUser)

module.exports = router;