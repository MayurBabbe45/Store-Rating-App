const { Store, Rating, User, sequelize } = require('../models');
const { Op } = require('sequelize');

// =======================
// Get All Stores with Ratings and User's Rating
// =======================
const getStores = async (req, res) => {
  try {
    const { search, sortBy, sortOrder } = req.query;
    const userId = req.user.id;

    // Build where clause for search
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { address: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Build order clause
    const order = sortBy
      ? [
          [
            sortBy === 'rating' ? 'averageRating' : sortBy,
            sortOrder === 'desc' ? 'DESC' : 'ASC',
          ],
        ]
      : [['name', 'ASC']];

    // Fetch stores
    const stores = await Store.findAll({
      where,
      order,
      attributes: ['id', 'name', 'address', 'email', 'averageRating', 'ratingCount'],
    });

    // Get store IDs
    const storeIds = stores.map((s) => s.id);

    // Get user's ratings for these stores
    const userRatings = await Rating.findAll({
      where: {
        userId,
        storeId: { [Op.in]: storeIds },
      },
      attributes: ['storeId', 'ratingValue'],
    });

    // Create a map of user ratings
    const ratingMap = {};
    userRatings.forEach((rating) => {
      ratingMap[rating.storeId] = rating.ratingValue;
    });

    // Add user's rating to each store
    const storesWithUserRating = stores.map((store) => ({
      ...store.toJSON(),
      userRating: ratingMap[store.id] || null,
    }));

    res.status(200).json({ stores: storesWithUserRating });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
};

// =======================
// Submit or Update Rating
// =======================
const submitRating = async (req, res) => {
  try {
    const { storeId, ratingValue } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const store = await Store.findByPk(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Check if rating already exists
    let rating = await Rating.findOne({ where: { userId, storeId } });

    if (rating) {
      // Update existing rating
      await rating.update({ ratingValue });
    } else {
      // Create new rating
      rating = await Rating.create({ userId, storeId, ratingValue });
    }

    // Recalculate average rating and count
    const result = await Rating.findOne({
      where: { storeId },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating_value')), 'avgRating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      raw: true,
    });

    await store.update({
      averageRating: parseFloat(result.avgRating).toFixed(1),
      ratingCount: parseInt(result.count),
    });

    res.status(200).json({
      message: 'Rating submitted successfully',
      rating: {
        id: rating.id,
        storeId: rating.storeId,
        ratingValue: rating.ratingValue,
      },
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};

// =======================
// Export Controllers
// =======================
module.exports = {
  getStores,
  submitRating,
};
