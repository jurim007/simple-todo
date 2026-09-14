'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Tasks', 'createdAt');
    await queryInterface.removeColumn('Tasks', 'updatedAt');
    await queryInterface.removeColumn('Users', 'createdAt');
    await queryInterface.removeColumn('Users', 'updatedAt');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Tasks', 'createdAt', { type: Sequelize.DATE, allowNull: false });
    await queryInterface.addColumn('Tasks', 'updatedAt', { type: Sequelize.DATE, allowNull: false });
    await queryInterface.addColumn('Users', 'createdAt', { type: Sequelize.DATE, allowNull: false });
    await queryInterface.addColumn('Users', 'updatedAt', { type: Sequelize.DATE, allowNull: false });
  },
};