const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Permission = sequelize.define('Permission', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    storyId: { type: DataTypes.UUID, allowNull: false },
    role: { type: DataTypes.ENUM('author', 'editor', 'commenter', 'viewer'), allowNull: false },
    expiresAt: { type: DataTypes.DATE }
  });
  return Permission;
};