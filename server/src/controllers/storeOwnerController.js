const { Store, Rating, User } = require('../models');

// Get store owner dashboard
const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find store owned by this user
    const store = await Store.findOne({
      where: { ownerId: userId },
      attributes: ['id', 'name', 'address', 'averageRating', 'ratingCount']
    });

    if (!store) {
      return res.status(404).json({
        error: 'No store found for this owner'
      });
    }

    // Get all ratings for this store with user details
    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Respond with store info and ratings
    res.status(200).json({
      store: {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: parseFloat(store.averageRating),
        ratingCount: store.ratingCount
      },
      ratings: ratings.map(rating => ({
        id: rating.id,
        userName: rating.user.name,
        userEmail: rating.user.email,
        ratingValue: rating.ratingValue,
        createdAt: rating.createdAt
      }))
    });

  } catch (error) {
    console.error('Store owner dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

module.exports = {
  getDashboard
};
