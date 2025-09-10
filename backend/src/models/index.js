const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(process.env.DATABASE_URL, { dialect: 'postgres' });

const models = {
  User: require('./User')(sequelize),
  Story: require('./Story')(sequelize),
  Permission: require('./Permission')(sequelize),
  Comment: require('./Comment')(sequelize),
  EditHistory: require('./EditHistory')(sequelize)
};

Object.values(models).forEach(model => {
  if (model.associate) model.associate(models);
});

module.exports = { sequelize, ...models };