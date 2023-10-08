import { createPool } from 'mysql2';
import config from './app.config';

const main = createPool(config.db.main).promise();

export {
  // eslint-disable-next-line import/prefer-default-export
  main,
};
