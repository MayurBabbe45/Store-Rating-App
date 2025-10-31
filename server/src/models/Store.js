// src/models/Store.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Store = sequelize.define(
    'Store',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      address: {
        type: DataTypes.STRING(400),
        allowNull: false,
        validate: {
          len: [0, 400],
        },
      },
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'owner_id',
      },
      averageRating: {
        type: DataTypes.DECIMAL(2, 1),
        defaultValue: 0.0,
        field: 'average_rating',
      },
      ratingCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        field: 'rating_count',
      },
    },
    {
      tableName: 'stores',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Store;
};
