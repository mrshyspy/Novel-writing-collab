const Y = require('yjs');
const Redis = require('redis');
const { Story, EditHistory, Permission } = require('../models');
const jwt = require('jsonwebtoken');

const redis = Redis.createClient({ url: process.env.REDIS_URL });
redis.connect();

const initSocket = (io) => {
  io.on('connection', async (socket) => {
    const { storyId, token } = socket.handshake.query;
    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch {
      socket.disconnect();
      return;
    }

    const permission = await Permission.findOne({ where: { userId, storyId } });
    if (!permission || (permission.expiresAt && permission.expiresAt < new Date())) {
      socket.disconnect();
      return;
    }

    const doc = new Y.Doc();
    const story = await Story.findByPk(storyId);
    if (story.content) Y.applyUpdate(doc, new Uint8Array(story.content));

    socket.join(storyId);

    // Sync updates
    socket.on('update', async (update) => {
      Y.applyUpdate(doc, new Uint8Array(update));
      await Story.update({ content: Buffer.from(Y.encodeStateAsUpdate(doc)) }, { where: { id: storyId } });
      await EditHistory.create({ storyId, userId, changes: update });
      socket.broadcast.to(storyId).emit('update', update);
    });

    // Track presence
    redis.hset(`story:${storyId}:presence`, userId, JSON.stringify({ id: userId, name: socket.handshake.auth.name }));
    socket.broadcast.to(storyId).emit('presence', { userId, status: 'online' });

    socket.on('cursor', (cursor) => {
      redis.hset(`story:${storyId}:presence`, userId, JSON.stringify({ id: userId, cursor }));
      socket.broadcast.to(storyId).emit('cursor', { userId, cursor });
    });

    socket.on('disconnect', () => {
      redis.hdel(`story:${storyId}:presence`, userId);
      socket.broadcast.to(storyId).emit('presence', { userId, status: 'offline' });
    });
  });
};

module.exports = { initSocket };