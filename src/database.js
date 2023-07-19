import { createPool } from 'mysql2';

const pool = createPool({
    host: "localhost",
    Post:"3306",
    user: "root",
    password: "napat171997",
    database: 'mydb'
}).promise();



export default pool;
