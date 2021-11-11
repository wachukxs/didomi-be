'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.User, { // means Event have a mediaId
        targetKey: 'id',
        foreignKey: 'userId',
        as: 'consents'
      })

    }
  };
  Event.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    age: {
      type: DataTypes.VIRTUAL,
      get() {
        return moment(this.getDataValue('createdAt')).fromNow();
      },
      set(value) {
        throw new Error('Do not try to set the Event.`age` value!');
      }
    },

    emailNotifications: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    smsNotifications: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE
    },

  }, {
    sequelize,
    updatedAt: false,
    // timestamps: true,
    modelName: 'Event',
  });

  return Event;
};