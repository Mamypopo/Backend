import { createPool } from 'mysql2';

const pool = createPool().promise();

export default pool;
