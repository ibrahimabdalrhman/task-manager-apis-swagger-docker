import { Sequelize } from 'sequelize';
import { env } from '../config/env';
import { initProjectModel, Project } from './Project';
import { initTaskModel, Task } from './Task';
import { initUserModel, User } from './User';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  logging: env.NODE_ENV === 'development' ? console.log : false,
});

initUserModel(sequelize);
initProjectModel(sequelize);
initTaskModel(sequelize);

User.hasMany(Project, { foreignKey: 'userId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

export { sequelize, User, Project, Task };
