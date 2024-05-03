import chalk from 'chalk';

class Logger {
  get now() {
    return Intl.DateTimeFormat("en-IN", {
      minute: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      month: "2-digit",
      year: "numeric",
      second: "2-digit",
    }).format(Date.now());
  }

  /**
   * @param {string} type
   * @param {unknown} error
   */
  error(type: string, error: Error | string) {
    return console.error(`${chalk.red("[ERROR]")}[${type.toUpperCase()}][${this.now}]: ${error}`);
  }

  /**
   * @param {string} type
   * @param {string} warning
   */
  warn(type: string, warning: string) {
    return console.warn(
      `${chalk.yellow("[WARNING]")}[${type.toUpperCase()}][${this.now}]: ${warning}`
    );
  }

  /**
   * @param {string} type
   * @param {string} content
   */
  info(type: string, content: string) {
    return console.log(
      `${chalk.blueBright("[INFO]")}[${type.toUpperCase()}][${this.now}]: ${content}`
    );
  }

  /**
   * @param {string} type
   * @param {string} text
   */
  debug(type: string, text: string) {
    return console.log(`${chalk.green("[DEBUG]")}[${type.toUpperCase()}][${this.now}]: ${text}`);
  }
}

export const logger = new Logger()