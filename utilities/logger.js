const initializeLogger = async () => {
  const chalk = (await import('chalk')).default;

  const logger = {
    info: (message) => console.log(chalk.cyan(message)),
    success: (message) => console.log(chalk.green.bold(message)),
    error: (message) => console.error(chalk.red(message)),
    warn: (message) => console.warn(chalk.yellow(message)),
  };

  return logger;
};

module.exports = initializeLogger;
