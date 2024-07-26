// load .env data into process.env
require('dotenv').config();

// Other dependencies
const fs = require('fs');
const { Pool } = require('pg');

(async () => {
  
  const chalk = (await import('chalk')).default;

  // PG connection setup
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DATABASE_URL,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });

  try {
    console.log(chalk.yellow('----------------------------------------------'));
    console.log(chalk.yellow.bold('          Server Initialization'));
    console.log(chalk.yellow('----------------------------------------------\n'));

    console.log(chalk.cyan(`-> Connecting to PostgreSQL using: ${chalk.blue.bold(pool.options.database)} ...\n`));
    await pool.connect();

    console.log(chalk.green.bold('✓ Connected to PostgreSQL successfully!\n'));

    pool.end();
    console.log(chalk.green.bold('✓ Database connection closed successfully.\n'));

    console.log(chalk.yellow('----------------------------------------------'));
    console.log(chalk.green.bold(`✓ Express server is now running on port ${chalk.blue.bold(process.env.PORT)}.`));
    console.log(chalk.yellow('----------------------------------------------'));

  } catch (err) {
    console.error(chalk.red.bold('✗ Failed due to error:'));
    console.error(chalk.red(err));
    pool.end();
    process.exit();
  }
})();
