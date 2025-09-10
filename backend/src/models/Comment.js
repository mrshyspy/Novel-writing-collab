const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    storyId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    position: { type: DataTypes.JSONB }
  });
  return Comment;
};