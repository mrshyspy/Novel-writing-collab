const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Story = sequelize.define('Story', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.BLOB }, // Changed to BLOB for Yjs binary state
    ownerId: { type: DataTypes.UUID, allowNull: false }
  });

  Story.associate = (models) => {
    Story.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });
    Story.hasMany(models.Permission, { foreignKey: 'storyId' });
    Story.hasMany(models.Comment, { foreignKey: 'storyId' });
    Story.hasMany(models.EditHistory, { foreignKey: 'storyId' });
  };
  return Story;
};