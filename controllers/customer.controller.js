// customerController.js
const Customer = require('../models/customer.model');
const Permission = require('../models/permission.model');
const AppError = require('../utils/appError');

exports.createCustomer = async (req, res, next) => {
  try {
    if (req.user.role === 'employee') {
      const userPermissions = req.user.permissions;
      
      const invalidServices = req.body.services.filter(serviceId => !userPermissions.includes(serviceId));
      
      if (invalidServices.length > 0) {
        return next(new AppError('You do not have permission to use one or more of the specified services', 403));
      }
    }
    
    const customer = await Customer.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        customer
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    if (req.user.role === 'employee') {
      const userPermissions = req.user.permissions;
      
      const invalidServices = req.body.services.filter(serviceId => !userPermissions.includes(serviceId));
      
      if (invalidServices.length > 0) {
        return next(new AppError('You do not have permission to use one or more of the specified services', 403));
      }
    }
    
    const { customerId } = req.params;
    const customer = await Customer.findByIdAndUpdate(customerId, req.body, { new: true });
    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        customer
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteCustomer = async (req, res, next) => {
  try {
    if (req.user.role === 'employee') {
      const userPermissions = req.user.permissions;
      
      const invalidServices = req.body.services.filter(serviceId => !userPermissions.includes(serviceId));
      
      if (invalidServices.length > 0) {
        return next(new AppError('You do not have permission to use one or more of the specified services', 403));
      }
    }
    
    const { customerId } = req.params;
    const customer = await Customer.findByIdAndDelete(customerId);
    if (!customer) {
      return next(new AppError('Customer not found', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllCustomers = async (req, res, next) => {
  try {
    const userPermissions = req.user.permissions;
    
    const customers = await Customer.find({ services: { $in: userPermissions } }).populate('services');

    res.status(200).json({
      status: 'success',
      data: {
        customers
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: error.message
    });
  }
};
