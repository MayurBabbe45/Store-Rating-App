// src/models/index.js
const { sequelize } = require('../config/database');
const UserModel = require('./User');
const StoreModel = require('./Store');
const RatingModel = require('./Rating');

// Initialize models
const User = UserModel(sequelize);
const Store = StoreModel(sequelize);
const Rating = RatingModel(sequelize);

// Define associations

// 1️⃣ Store Owner → Store (One-to-One)
User.hasOne(Store, {
  foreignKey: 'ownerId',
  as: 'ownedStore',
});
Store.belongsTo(User, {
  foreignKey: 'ownerId',
  as: 'owner',
});

// 2️⃣ User → Ratings (One-to-Many)
User.hasMany(Rating, {
  foreignKey: 'userId',
  as: 'ratings',
});
Rating.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// 3️⃣ Store → Ratings (One-to-Many)
Store.hasMany(Rating, {
  foreignKey: 'storeId',
  as: 'ratings',
});
Rating.belongsTo(Store, {
  foreignKey: 'storeId',
  as: 'store',
});

// 4️⃣ User ↔ Store (Many-to-Many through Ratings)
User.belongsToMany(Store, {
  through: Rating,
  foreignKey: 'userId',
  otherKey: 'storeId',
  as: 'ratedStores',
});
Store.belongsToMany(User, {
  through: Rating,
  foreignKey: 'storeId',
  otherKey: 'userId',
  as: 'raters',
});

module.exports = {
  sequelize,
  User,
  Store,
  Rating,
};
