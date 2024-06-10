const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../controllers/auth.controller');
const {
  createPermission,
  getAllPermissions,
  assignPermissions,
  deletePermission,
  deleteUserPermission,
  giveAllPermissionsToUser,
  revokeAllPermissionsToUser
} = require('../controllers/permission.controller');

router.post('/createPermission', protect, restrictTo('admin'), createPermission);
router.get('/getAllPermissions', protect, restrictTo('admin'), getAllPermissions);
router.post('/assignPermissions', protect, restrictTo('admin'), assignPermissions);
router.post('/giveAllPermissions/:userId', protect, restrictTo('admin'), giveAllPermissionsToUser);
router.delete('/revokeAllPermissions/:userId', protect, restrictTo('admin'), revokeAllPermissionsToUser);
router.delete('/deletePermission/:permissionId', protect, restrictTo('admin'), deletePermission);
router.delete('/deleteUserPermission/:userId/:permissionId', protect, restrictTo('admin'), deleteUserPermission);

module.exports = router;
