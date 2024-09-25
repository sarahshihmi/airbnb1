'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, { foreignKey: 'ownerId' });
      Spot.hasMany(models.Booking, { foreignKey: 'spotId' });
      Spot.hasMany(models.Review, { foreignKey: 'spotId' });
      Spot.hasMany(models.SpotImage, { foreignKey: 'spotId' });
    }
  }
  Spot.init(
    {
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: [true],
            msg: 'Street address is required',
          },
          notEmpty: {
            args: [true],
            msg: 'Street address is required',
          },
        },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: [true],
            msg: 'City is required',
          },
          notEmpty: {
            args: [true],
            msg: 'City is required',
          },
        },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: [true],
            msg: 'State is required',
          },
          notEmpty: {
            args: [true],
            msg: 'State is required',
          },
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: [true],
            msg: 'Country is required',
          },
          notEmpty: {
            args: [true],
            msg: 'Country is required',
          },
        },
      },
      lat: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        validate: {
          min: {
            args: [-90],
            msg: 'Latitude must be between -90 and 90',
          },
          max: {
            args: [90],
            msg: 'Latitude must be between -90 and 90',
          },
        },
      },
      lng: {
        type: DataTypes.NUMERIC,
        allowNull: false,
        validate: {
          min: {
            args: [-180],
            msg: 'Longitude must be between -180 and 180',
          },
          max: {
            args: [180],
            msg: 'Longitude must be between -180 and 180',
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: [true],
            msg: 'The name of spot is required',
          },
          notEmpty: {
            args: [true],
            msg: 'The name of spot is required',
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: [true],
            msg: 'A description of spot is required',
          },
          notEmpty: {
            args: [true],
            msg: 'A description of spot is required',
          },
        },
      },
      price: {
        type: DataTypes.NUMERIC,
        validate: {
          min: {
            args: [0.01],
            msg: 'The price must be greater than 0',
          },
        },
      },
      ownerId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Spot',
    }
  );
  return Spot;
};