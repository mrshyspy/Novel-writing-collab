const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Story, Permission, Comment, User } = require('../models');
const { Op } = require('sequelize');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all stories for user
router.get('/', auth, async (req, res) => {
  try {
    const permissions = await Permission.findAll({ where: { userId: req.user.id } });
    const storyIds = permissions.map(p => p.storyId);
    const stories = await Story.findAll({ where: { id: { [Op.in]: storyIds } } });
    res.json(stories);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create story
router.post('/', auth, async (req, res) => {
  const { title } = req.body;
  try {
    const story = await Story.create({ title, ownerId: req.user.id });
    await Permission.create({ userId: req.user.id, storyId: story.id, role: 'author' });
    res.status(201).json(story);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get story
router.get('/:id', auth, async (req, res) => {
  const permission = await Permission.findOne({
    where: { userId: req.user.id, storyId: req.params.id }
  });
  if (!permission) return res.status(403).json({ error: 'Access denied' });
  const story = await Story.findByPk(req.params.id);
  res.json(story);
});

// Invite collaborator
router.post('/:id/invite', auth, async (req, res) => {
  const { email, role, expiresAt } = req.body;
  const story = await Story.findByPk(req.params.id);
  if (story.ownerId !== req.user.id) return res.status(403).json({ error: 'Only owner can invite' });
  const collaborator = await User.findOne({ where: { email } });
  if (!collaborator) return res.status(404).json({ error: 'User not found' });
  await Permission.create({
    userId: collaborator.id,
    storyId: req.params.id,
    role,
    expiresAt: expiresAt ? new Date(expiresAt) : null
  });
  res.json({ message: 'Invite sent' });
});

// Add comment
router.post('/:id/comments', auth, async (req, res) => {
  const { content, position } = req.body;
  const permission = await Permission.findOne({
    where: { userId: req.user.id, storyId: req.params.id, role: { [Op.in]: ['author', 'editor', 'commenter'] } }
  });
  if (!permission) return res.status(403).json({ error: 'Access denied' });
  const comment = await Comment.create({
    storyId: req.params.id,
    userId: req.user.id,
    content,
    position
  });
  res.status(201).json(comment);
});

module.exports = router;