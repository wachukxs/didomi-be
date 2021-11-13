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
    sn: {
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

    id: {
      type: DataTypes.STRING,
      default: false,
      validate: {
        isIn: [['email_notifications', 'sms_notifications']]
      }
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      default: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.INTEGER,
      allowNull: false,
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