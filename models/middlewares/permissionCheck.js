const User = require('../models/user.model');
const Permission = require('../models/permission.model');
const AppError = require('../utils/appError');

exports.checkPermission = (permissionName) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user.id).populate('permissions');
    if (!user || !user.hasPermission(permissionName)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
