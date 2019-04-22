
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('tabs', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      group_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      date_added: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.fn('now')
      }
    }, {
      tableName: 'tabs'
    });
  };
  