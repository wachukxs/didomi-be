'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      emailNotifications: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      smsNotifications: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      userEmail: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
};