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
    // this has only data present in the ongoing operation (like insert, delete, update, or select)
    
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
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
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
    createdAt: { // convert to string, it causes error for .ejs template ...plus it's just safer to have '2021-06-12T18:44:22.683Z' in stead of 2021-06-12T18:44:22.683Z
      type: DataTypes.DATE,
    },
    timeWithUs: { // must be aftr 'createdAt' ... should we make a PR to fix this ?
      type: DataTypes.VIRTUAL,
      get() {
        return moment(this.getDataValue('createdAt')).fromNow();
      },
      set(value) {
        console.error('Do not try to set the User.`timeWithUs` value!');
        // throw new Error('Do not try to set the User.`timeWithUs` value!');
      },
      comment: 'What should we do with this? Make them invite others after a while? Or ask them how it has been so far?'
    },
    /**
     * virtual fields aren't ideal because they are not enumerable fields
     */

    password: DataTypes.STRING,

    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,

    // maybe have a session insight field of all the corp members's search histroy, liked items, (find how to figure out items they're intrested in)
  }, {
    sequelize,
    updatedAt: false,
    // timestamps: true,
    modelName: 'User',
    hooks: { // used to add virtual fields to dataValues object
      afterCreate(corpMember, {}) {
        // corpMember.dataValues.servicestate = ngstates.states_long[ngstates.states_short.indexOf(corpMember.statecode.trim().slice(0, 2).toUpperCase())]
        // corpMember.dataValues._location = corpMember.getServiceState(); // or corpMember.dataValues.servicestate; // only using servicestate because city_town won't be existing

        // corpMember.servicestate = ngstates.states_long[ngstates.states_short.indexOf(corpMember.statecode.trim().slice(0, 2).toUpperCase())]
        // corpMember._location = corpMember.getServiceState(); // or corpMember.servicestate;
      },
      afterFind(corpMember, {}) {
        if (corpMember) { // for when we do a find during login, and corp member doesn't exist
          // corpMember.dataValues.servicestate = ngstates.states_long[ngstates.states_short.indexOf(corpMember.statecode.trim().slice(0, 2).toUpperCase())]
          // corpMember.dataValues._location = corpMember.getServiceState() + (corpMember.city_town ? ', ' + corpMember.city_town : '')

          // commnet if virtual fields are in use ...or remove error thrown in virtual fields
          // corpMember.servicestate = ngstates.states_long[ngstates.states_short.indexOf(corpMember.statecode.trim().slice(0, 2).toUpperCase())]
          // corpMember._location = corpMember.getServiceState() + (corpMember.city_town ? ', ' + corpMember.city_town : '')
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