const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: {
          args: [20, 60],
          msg: 'Name must be between 20 and 60 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Must be a valid email address'
        }
      }
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash'
    },
    address: {
      type: DataTypes.STRING(400),
      allowNull: true,
      validate: {
        len: {
          args: [0, 400],
          msg: 'Address must not exceed 400 characters'
        }
      }
    },
    role: {
      type: DataTypes.ENUM(['admin', 'user', 'store_owner']),
      allowNull: false,
      defaultValue: 'user'
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'store_id'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return User;
};
