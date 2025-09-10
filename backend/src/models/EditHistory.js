const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const EditHistory = sequelize.define('EditHistory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    storyId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID, allowNull: false },
    changes: { type: DataTypes.BLOB }, // Changed to BLOB for Yjs updates
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });
  return EditHistory;
};