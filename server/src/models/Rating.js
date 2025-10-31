// src/models/Rating.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Rating = sequelize.define(
    'Rating',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'store_id',
      },
      ratingValue: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'rating_value',
        validate: {
          min: 1,
          max: 5,
        },
      },
    },
    {
      tableName: 'ratings',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['user_id', 'store_id'],
        },
      ],
    }
  );

  return Rating;
};
