const mongoose = require('mongoose');
const User = require('../models/User');
const memoryStore = require('../config/memoryStore');
const { generateToken } = require('../middleware/authMiddleware');

const isConnected = () => mongoose.connection.readyState === 1;

const registerUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
      phone,
      organization,
      address,
      city,
    } = req.body;

    if (!name || !email || !password || !phone || !address || !city) {
      res.status(400);
      throw new Error('Please provide all required fields: name, email, password, phone, address, city');
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isConnected()) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        res.status(400);
        throw new Error('A user with this email address already exists');
      }

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        role: role ? role.toLowerCase() : 'donor',
        phone: phone.trim(),
        organization: organization ? organization.trim() : '',
        address: address.trim(),
        city: city.toLowerCase().trim(),
      });

      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          organization: user.organization,
          address: user.address,
          city: user.city,
          createdAt: user.createdAt,
        },
      });
    } else {
      const userExists = await memoryStore.findUserByEmail(normalizedEmail);
      if (userExists) {
        res.status(400);
        throw new Error('A user with this email address already exists');
      }

      const user = await memoryStore.createUser({
        name,
        email: normalizedEmail,
        password,
        role,
        phone,
        organization,
        address,
        city,
      });

      const token = generateToken(user._id);
      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          organization: user.organization,
          address: user.address,
          city: user.city,
          createdAt: user.createdAt,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isConnected()) {
      const user = await User.findOne({ email: normalizedEmail });

      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user._id);
        return res.status(200).json({
          success: true,
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            organization: user.organization,
            address: user.address,
            city: user.city,
            createdAt: user.createdAt,
          },
        });
      } else {
        res.status(401);
        throw new Error('Invalid email or password');
      }
    } else {
      const user = await memoryStore.findUserByEmail(normalizedEmail);

      if (user && (await memoryStore.verifyPassword(user, password))) {
        const token = generateToken(user._id);
        return res.status(200).json({
          success: true,
          token,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            organization: user.organization,
            address: user.address,
            city: user.city,
            createdAt: user.createdAt,
          },
        });
      } else {
        res.status(401);
        throw new Error('Invalid email or password');
      }
    }
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    if (isConnected()) {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        res.status(404);
        throw new Error('User profile not found');
      }
      return res.status(200).json({ success: true, user });
    } else {
      const user = await memoryStore.findUserById(req.user._id);
      if (!user) {
        res.status(404);
        throw new Error('User profile not found');
      }
      return res.status(200).json({ success: true, user });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
