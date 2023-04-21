
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Selects', {
      type: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      describe: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Selects');
  },
};
