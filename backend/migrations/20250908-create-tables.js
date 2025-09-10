const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('Users', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      name: { type: DataTypes.STRING },
      role: { type: DataTypes.ENUM('author', 'editor', 'commenter', 'viewer'), defaultValue: 'viewer' },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });

    await queryInterface.createTable('Stories', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.JSONB },
      ownerId: { type: DataTypes.UUID, references: { model: 'Users', key: 'id' } },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });

    await queryInterface.createTable('Permissions', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, references: { model: 'Users', key: 'id' } },
      storyId: { type: DataTypes.UUID, references: { model: 'Stories', key: 'id' } },
      role: { type: DataTypes.ENUM('author', 'editor', 'commenter', 'viewer'), allowNull: false },
      expiresAt: { type: DataTypes.DATE },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });

    await queryInterface.createTable('Comments', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      storyId: { type: DataTypes.UUID, references: { model: 'Stories', key: 'id' } },
      userId: { type: DataTypes.UUID, references: { model: 'Users', key: 'id' } },
      content: { type: DataTypes.TEXT, allowNull: false },
      position: { type: DataTypes.JSONB },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });

    await queryInterface.createTable('EditHistories', {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      storyId: { type: DataTypes.UUID, references: { model: 'Stories', key: 'id' } },
      userId: { type: DataTypes.UUID, references: { model: 'Users', key: 'id' } },
      changes: { type: DataTypes.JSONB },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('EditHistories');
    await queryInterface.dropTable('Comments');
    await queryInterface.dropTable('Permissions');
    await queryInterface.dropTable('Stories');
    await queryInterface.dropTable('Users');
  }
};