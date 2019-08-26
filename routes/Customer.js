const express = require('express')
const router = express.Router()
const Customer = require ('../controller/customer')

router.get('/', Customer.getAllcustomer );
router.post('/', Customer.createCustomer);
router.get('/:customerId',Customer.getOneCustomer);
router.get('/search/:term',Customer.searchCustomer);
router.put('/:customerId', Customer.updateCustomer);
router.delete('/:customerId', Customer.deleteCustomer);

module.exports = router;