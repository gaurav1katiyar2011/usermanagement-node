const Sequelize = require('sequelize');
const UserModel = require('./models/UserModel')
const GroupModel = require('./models/GroupModel')
const sequelize = new Sequelize('sequelize', 'postgres', null, {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    timestamps: false
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
const User = UserModel(sequelize, Sequelize)
const Group = GroupModel(sequelize, Sequelize)
sequelize.sync()
  .then(() => {
    console.log(`Database & tables created!`)
  })
module.exports = {
  User,
  Group
}
