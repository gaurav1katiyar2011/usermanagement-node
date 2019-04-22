const Sequelize = require('sequelize');
const UserModel = require('./models/UserModel')
const GroupModel = require('./models/GroupModel')
const TabModel = require('./models/TabModel')
const Op = Sequelize.Op;
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

const sequelize = new Sequelize('sequelize', 'postgres', null, {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases,
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
const Tabs = TabModel(sequelize, Sequelize)
db.users = Users;
db.groups = Groups;
db.tabs = Tabs;
//Relations
db.groups.hasMany(db.users, {foreignKey: 'group_id'})
db.users.belongsTo(db.groups, {foreignKey: 'group_id'})

db.groups.hasMany(db.tabs,{foreignKey: 'group_id'})
db.tabs.belongsTo(db.groups, {foreignKey: 'group_id'})
// sequelize.sync()
//   .then(() => {
//     console.log(`Database & tables created!`)
//   })
module.exports = db;  




