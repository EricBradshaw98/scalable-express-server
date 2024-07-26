require('dotenv').config();
const app = require('../app');
const pool = require('../db/config/db');
const initializeLogger = require('../utilities/logger');

const startServer = async (logger) => {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    logger.success(`Server is running on port ${port}`);
  });
};

const initialize = async () => {
  const logger = await initializeLogger();

  try {
    logger.warn('---------------------------------------------');
    logger.warn('          Server Initialization');
    logger.warn('---------------------------------------------');
    logger.info(`-> Connecting to PostgreSQL using: ${process.env.DB_HOST}`);
    logger.warn('---------------------------------------------\n');
    await pool.connect();
    logger.success('✓ Connected to PostgreSQL successfully!\n');

    await startServer(logger);
  } catch (err) {
    logger.error(`Failed due to error: ${err}`);
    process.exit(1);
  }
};

initialize();
