
const User = require('../models/user.model');
const Permission = require('../models/permission.model');

const seedAdmin = async () => {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      const permissions = await Permission.find();
      const newAdmin = new User({
        name: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
        role: 'admin',
        permissions: permissions.map(permission => permission._id)
      });
      await newAdmin.save();
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin already exists.');
    }
};

seedAdmin();
