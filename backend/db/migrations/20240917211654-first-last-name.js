'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('users', 'firstName', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'Unknown'
    });
    
    await queryInterface.addColumn('users', 'lastName', {
      type: Sequelize.STRING(50),
      allowNull: false,
      defaultValue: 'Unknown'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Users', 'firstName');
    await queryInterface.removeColumn('Users', 'lastName');

  }
};
