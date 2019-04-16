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

const db = {};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

const Users = UserModel(sequelize, Sequelize)
const Groups = GroupModel(sequelize, Sequelize)
db.users = Users;
db.groups = Groups;
//Relations
db.groups.hasMany(db.users, {foreignKey: 'group_id'})
db.users.belongsTo(db.groups, {foreignKey: 'group_id'})

// sequelize.sync()
//   .then(() => {
//     console.log(`Database & tables created!`)
//   })
module.exports = db;  




