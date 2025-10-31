const bcrypt = require('bcrypt');
const { User, Store, Rating } = require('../models');
const { Op } = require('sequelize');

// =======================
// Dashboard Statistics
// =======================
const getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.status(200).json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// =======================
// Create New User (any role)
// =======================
const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      address,
      role: role || 'user',
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// =======================
// Get All Users (with filters & sorting)
// =======================
const getUsers = async (req, res) => {
  try {
    const { name, email, address, role, sortBy, sortOrder } = req.query;

    // Build where clause
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    // Build order clause
    const order = sortBy
      ? [[sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']]
      : [['created_at', 'DESC']];  // FIXED HERE

    // Fetch users
    const users = await User.findAll({
      where,
      order,
      attributes: { exclude: ['passwordHash'] },
      include: [
        {
          model: Store,
          as: 'ownedStore',
          attributes: ['id', 'name', 'averageRating'],
          required: false,
        },
      ],
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// =======================
// Get User By ID
// =======================
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: { exclude: ['passwordHash'] },
      include: [
        {
          model: Store,
          as: 'ownedStore',
          attributes: ['id', 'name', 'averageRating'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// =======================
// Create New Store
// =======================
const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    // Verify owner exists and has store_owner role
    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== 'store_owner') {
      return res
        .status(400)
        .json({ error: 'Invalid owner ID or user is not a store owner' });
    }

    // Check if owner already has a store
    const existingStore = await Store.findOne({ where: { ownerId } });
    if (existingStore) {
      return res.status(409).json({ error: 'Store owner already has a store' });
    }

    // Check if email exists
    const emailExists = await Store.findOne({ where: { email } });
    if (emailExists) {
      return res.status(409).json({ error: 'Store email already exists' });
    }

    // Create store
    const store = await Store.create({
      name,
      email,
      address,
      ownerId,
    });

    // Update user's storeId
    await owner.update({ storeId: store.id });

    res.status(201).json({
      message: 'Store created successfully',
      store,
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Failed to create store' });
  }
};

// =======================
// Get All Stores (with filters & sorting)
// =======================
const getStores = async (req, res) => {
  try {
    const { name, email, address, sortBy, sortOrder } = req.query;

    // Build where clause
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    // Build order clause
    const order = sortBy
      ? [[sortBy === 'rating' ? 'averageRating' : sortBy, sortOrder === 'desc' ? 'DESC' : 'ASC']]
      : [['created_at', 'DESC']];  // FIXED HERE

    // Fetch stores
    const stores = await Store.findAll({
      where,
      order,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    res.status(200).json({ stores });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

// =======================
// Export Module
// =======================
module.exports = {
  getDashboard,
  createUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
};
