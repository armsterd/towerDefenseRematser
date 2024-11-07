import mysql from 'mysql2/promise.js';
import { config } from '../config/config.js';

const { database } = config;

const createPool = (dbConfig) => {
  const pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.name,
  });

  const originQuery = pool.query;
  pool.query = (sql, params) => {
    const date = new Date();
    console.log(`[${date}] Executing query: ${sql} ${params ? `, ${JSON.stringify(params)}` : ``}`);

    return originQuery.call(pool, sql, params);
  };

  return pool;
};

const pools = {
  USER_DB: createPool(database.USER_DB),
};

export default pools;
