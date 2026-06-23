'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash('Password123!', 10);

    await queryInterface.bulkInsert('users', [
      {
        id: 'a0000000-0000-4000-8000-000000000001',
        name: 'Admin User',
        email: 'admin@example.com',
        password: passwordHash,
        role: 'admin',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'a0000000-0000-4000-8000-000000000002',
        name: 'Member User',
        email: 'member@example.com',
        password: passwordHash,
        role: 'member',
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert('projects', [
      {
        id: 'b0000000-0000-4000-8000-000000000001',
        title: 'Website Redesign',
        description: 'Redesign the company website with modern UI/UX',
        status: 'active',
        userId: 'a0000000-0000-4000-8000-000000000002',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'b0000000-0000-4000-8000-000000000002',
        title: 'Mobile App Launch',
        description: 'Launch the new mobile application on iOS and Android',
        status: 'active',
        userId: 'a0000000-0000-4000-8000-000000000001',
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert('tasks', [
      {
        id: 'c0000000-0000-4000-8000-000000000001',
        title: 'Create wireframes',
        description: 'Design wireframes for all main pages',
        status: 'done',
        priority: 'high',
        dueDate: new Date('2026-07-01'),
        projectId: 'b0000000-0000-4000-8000-000000000001',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000002',
        title: 'Implement homepage',
        description: 'Build the new homepage with responsive design',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date('2026-08-15'),
        projectId: 'b0000000-0000-4000-8000-000000000001',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'c0000000-0000-4000-8000-000000000003',
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated deployment for mobile app',
        status: 'pending',
        priority: 'medium',
        dueDate: new Date('2026-09-01'),
        projectId: 'b0000000-0000-4000-8000-000000000002',
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('tasks', null, {});
    await queryInterface.bulkDelete('projects', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
