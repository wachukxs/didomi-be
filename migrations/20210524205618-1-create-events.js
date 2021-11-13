'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Events', {
      sn: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users',
            
          },
          key: 'id'
        },
      },
      userEmail: {
        type: Sequelize.STRING,
        references: {
          model: {
            tableName: 'Users',
            
          },
          key: 'email'
        },
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        default: false
      },
      id: {
        type: Sequelize.STRING,
        default: false
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