const bcrypt = require('bcryptjs');
const { User, Story, Permission } = require('./src/models');
async function seed() {
  const user = await User.create({
    email: 'test@example.com',
    password: await bcrypt.hash('password123', 10),
    name: 'Test User',
    role: 'author'
  });

  const story = await Story.create({
    title: 'Sample Novel',
    ownerId: user.id,
    content: Buffer.from(new Uint8Array([0]))
  });

  await Permission.create({
    userId: user.id,
    storyId: story.id,
    role: 'author'
  });

  console.log('Database seeded');
}

seed().catch(console.error);