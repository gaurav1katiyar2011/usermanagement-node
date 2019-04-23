module.exports = function(sequelize, DataTypes) {
    return sequelize.define('customers', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true
      },
      customer_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      customer_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      updated_user_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      date_added: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize.fn('now')
      }
    }, {
      tableName: 'customers'
    });
  };
  