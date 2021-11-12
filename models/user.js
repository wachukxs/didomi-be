'use strict';
const {
  Model
} = require('sequelize');
const moment = require('moment');

/**
 * use sparQL to show relationship between data ... show friend of a friend relationship ...esp between people selling and buyiing ... got introduced by Simeon
 * @param {*} sequelize 
 * @param {*} DataTypes 
 * @returns 
 */
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    /**
     * User attributes without password,
     * impl idea from https://stackoverflow.com/a/66956107/9259701
     * @returns array of attributes without password
     */
    static getSafeAttributes() {
      let userAttributes = Object.keys(User.rawAttributes)
      userAttributes.splice(userAttributes.indexOf('password'), 1);
      return userAttributes
    }

    static associate(models) {
      // define association here
      
      User.hasMany(models.Event, {
        foreignKey: 'userId',
        sourceKey: 'id',
        as: 'consents'
      });

    }
  };
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    
    email: {
      type:DataTypes.STRING,
      allowNull: false,
      unique: true,
      set(value) {
        this.setDataValue('email', value.toLowerCase());
      }
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    timeWithUs: { // must be aftr 'createdAt'
      type: DataTypes.VIRTUAL,
      get() {
        return moment(this.getDataValue('createdAt')).fromNow();
      },
      set(value) {
        console.error('Do not try to set the User.`timeWithUs` value!');
        // throw new Error('Do not try to set the User.`timeWithUs` value!');
      },
      comment: 'So we know how long they have been with us.'
    },

    password: {
      type: DataTypes.STRING,
      allowNull: true
    },

    firstname: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // maybe have a session insight field of all the corp members's search histroy, liked items, (find how to figure out items they're intrested in)
  }, {
    sequelize,
    updatedAt: false,
    // timestamps: true,
    modelName: 'User',
    hooks: { // used to add virtual fields to dataValues object
      afterCreate(user, {}) {
        if (user.dataValues.servicestate) {
          user.dataValues.servicestate = ''
        }
        if (user.servicestate) {
          user.servicestate = ''
        }
      },
      afterFind(user, {}) {
        if (user) {
          
        }
      },
      
    }
  });

  return User;
};

/**
 * maybe add a hook that'll include virtual fields in the returned defaultValue object on creation/insert (only access it if you call result.virtualfield)
 * 
 * virtual field is a scam, it doesn't exist in the defaultValues section (even after you reassign). it's redundant adding it via hooks
 * 
 * This error happens for virtual servicestate field: (when sync({alter: true}))
 * 
 * Executing (default): ALTER TABLE "CorpMembers" ALTER COLUMN "servicestate" DROP NOT NULL;ALTER TABLE "CorpMembers" ALTER COLUMN "servicestate" DROP DEFAULT;ALTER TABLE "CorpMembers" ALTER COLUMN "servicestate" TYPE VIRTUAL;
 * (node:2053) UnhandledPromiseRejectionWarning: SequelizeDatabaseError: type "virtual" does not exist
 */