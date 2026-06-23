import app from './app';
import { env } from './config/env';
import { sequelize } from './models';

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    app.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
      console.log(`Swagger docs available at http://localhost:${env.PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
