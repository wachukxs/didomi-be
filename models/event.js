'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {

    static associate(models) {
      // define association here
      Event.belongsTo(models.User, { // means Event have a userId
        targetKey: 'id',
        foreignKey: 'userId',
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