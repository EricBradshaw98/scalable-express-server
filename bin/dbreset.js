// load .env data into process.env
require('dotenv').config();
//test
// Other dependencies
const fs = require('fs');

const { Pool } = require('pg');



(async () => {
  
  const chalk = (await import('chalk')).default;

// PG connection setup
const pool = new Pool({
  

  user:  process.env.DB_USER,
    host:  process.env.DATABASE_URL,
    database:  process.env.DB_NAME,
    password:  process.env.DB_PASS,
    port:  process.env.DB_PORT,
});

// Loads the schema files from db/schema
const runSchemaFiles = async () => {
  console.log(chalk.cyan(`-> Loading Schema Files ...`));
  const schemaFilenames = fs.readdirSync('./db/schema');

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./db/schema/${fn}`, 'utf8');
    console.log(`\t-> Running ${chalk.green(fn)}`);
    await pool.query(sql);
  }
};

const runSeedFiles = async () => {
  console.log(chalk.cyan(`-> Loading Seeds ...`));
  const seedFilenames = fs.readdirSync('./db/seeds');

  for (const fn of seedFilenames) {
    const sql = fs.readFileSync(`./db/seeds/${fn}`, 'utf8');
    console.log(`\t-> Running ${chalk.green(fn)}`);
    await pool.query(sql);
  }
};

(async () => {
  try {
    console.log(chalk.yellow('---------------------------------------------'));
    console.log(chalk.yellow.bold('          Database Reset'));
    console.log(chalk.yellow('---------------------------------------------'));
    console.log(chalk.cyan(`-> Connecting to PostgreSQL using: ${chalk.blue.bold(pool.options.connectionString)} `));
    console.log(chalk.yellow('---------------------------------------------\n'));
    await pool.connect();
    await runSchemaFiles();
    await runSeedFiles();
    pool.end()
    console.log(chalk.cyan(`-> Finishing Reset ...`));
    console.log();
    console.log(chalk.yellow('---------------------------------------------'));
    console.log(chalk.green.bold(`-> Database reset completed successfully.`));
    console.log(chalk.yellow('---------------------------------------------'));
    process.exit(); // Add this line
  } catch (err) {
    console.error(chalk.red(`Failed due to error: ${err}`));
    pool.end();
    process.exit(1); // Exit with non-zero code to indicate failure
  }
})();
})();