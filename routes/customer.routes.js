// customerRoutes.js
const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../controllers/auth.controller');
const { createCustomer, updateCustomer, deleteCustomer , getAllCustomers } = require('../controllers/customer.controller');

router.post('/addcustomer', protect, restrictTo('admin', 'employee'), createCustomer);

router.get('/getallcustomers', protect, restrictTo('admin', 'employee'), getAllCustomers);

router.put('/updatecustomer/:customerId', protect, restrictTo('admin', 'employee'), updateCustomer);

router.delete('/deletecustomer/:customerId', protect, restrictTo('admin', 'employee'), deleteCustomer);


module.exports = router;
