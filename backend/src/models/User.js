const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('author', 'editor', 'commenter', 'viewer'), defaultValue: 'viewer' }
  });

  User.associate = (models) => {
    User.hasMany(models.Story, { foreignKey: 'ownerId', as: 'stories' });
    User.hasMany(models.Permission, { foreignKey: 'userId' });
    User.hasMany(models.Comment, { foreignKey: 'userId' });
    User.hasMany(models.EditHistory, { foreignKey: 'userId' });
  };
  return User;
};