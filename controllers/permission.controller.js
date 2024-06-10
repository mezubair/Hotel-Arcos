const Permission = require('../models/permission.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createPermission = catchAsync(async (req, res, next) => {
    const { name } = req.body;
    const newPermission = new Permission({ name });
    await newPermission.save();
    const admins = await User.find({ role: 'admin' });
    const adminUpdatePromises = admins.map(admin => {
      admin.permissions.push(newPermission._id);
      return admin.save({ validateModifiedOnly: true });
    });
    await Promise.all(adminUpdatePromises);
    
    res.status(201).json({ message: 'Permission created successfully and assigned to admin', permission: newPermission });
  });
  

exports.getAllPermissions = catchAsync(async (req, res, next) => {
  const permissions = await Permission.find();
  res.status(200).json(permissions);
});

exports.assignPermissions = catchAsync(async (req, res, next) => {
    const { userId, permissionIds } = req.body;
  
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
  
    // Check if all permission IDs are valid
    const validPermissionIds = await Permission.find({ _id: { $in: permissionIds } }).distinct('_id');
    if (validPermissionIds.length !== permissionIds.length) {
      return next(new AppError('One or more permission IDs are invalid', 400));
    }
  
    // Assign permissions to the user
    user.permissions = permissionIds;
    await user.save({validateModifiedOnly: true});
  
    res.status(200).json({ message: 'Permissions assigned successfully', user });
  });

  exports.giveAllPermissionsToUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
  
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
  
    // Get all permissions
    const allPermissions = await Permission.find();
  
    // Assign all permissions to the user
    user.permissions = allPermissions.map(permission => permission._id);
    await user.save({ validateModifiedOnly: true });
  
    res.status(200).json({
      status: 'success',
      message: 'All permissions assigned to user successfully',
      user
    });
  });


 exports.revokeAllPermissionsToUser = catchAsync(async (req, res, next) => {
    const { userId } = req.params;
  
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
  
    // Revoke all permissions
  user.permissions = [];
  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: 'success',
    message: 'All permissions revoked from user successfully',
    user
  });
  });


exports.deletePermission = catchAsync(async (req, res, next) => {
    const { permissionId } = req.params;
  
    // Delete the permission globally
    await Permission.findByIdAndDelete(permissionId);
  
    // Remove the permission from all users
    await User.updateMany({ permissions: permissionId }, { $pull: { permissions: permissionId } });
  
    res.status(200).json({ message: 'Permission deleted successfully' });
  });

  exports.deleteUserPermission = catchAsync(async (req, res, next) => {
    const { userId, permissionId } = req.params;
  
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError('User not found', 404));
    }
  
    // Remove the permission from the user
    const index = user.permissions.indexOf(permissionId);
    if (index !== -1) {
      user.permissions.splice(index, 1);
      await user.save({ validateModifiedOnly: true });
    }
  
    res.status(200).json({ message: 'Permission removed from user successfully' });
  });
