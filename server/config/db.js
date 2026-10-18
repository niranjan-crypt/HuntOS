const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const log = (level, msg) => console.log(`[${level}] [${new Date().toISOString()}] ${msg}`);

let pool = null;
let promisePool = null;
let isConnected = false;

// Auto-migration helper to add modern columns if they don't exist yet
async function runAutoMigrations(connection) {
  try {
    const tableAlterations = [
      {
        table: 'users',
        column: 'auth_provider',
        sql: "ALTER TABLE users ADD COLUMN auth_provider VARCHAR(50) DEFAULT 'local'",
      },
      {
        table: 'users',
        column: 'google_id',
        sql: 'ALTER TABLE users ADD COLUMN google_id VARCHAR(255) UNIQUE',
      },
      {
        table: 'applications',
        column: 'priority',
        sql: "ALTER TABLE applications ADD COLUMN priority VARCHAR(50) DEFAULT 'Medium'",
      },
      {
        table: 'applications',
        column: 'tags',
        sql: "ALTER TABLE applications ADD COLUMN tags VARCHAR(255) DEFAULT 'Full-Time'",
      },
      {
        table: 'applications',
        column: 'deadline',
        sql: 'ALTER TABLE applications ADD COLUMN deadline DATE NULL',
      },
      {
        table: 'resume_versions',
        column: 'ats_score',
        sql: 'ALTER TABLE resume_versions ADD COLUMN ats_score INT DEFAULT NULL',
      },
    ];

    for (const item of tableAlterations) {
      try {
        await connection.query(item.sql);
        log('INFO', `Auto-migration: Added column ${item.column} to ${item.table}`);
      } catch (err) {
        // Error code 1060 = Duplicate column name (column already exists)
        if (err.errno !== 1060 && !err.message.includes('Duplicate column')) {
          // Non-fatal, just log
        }
      }
    }
  } catch (err) {
    log('WARN', `Auto-migration non-fatal check: ${err.message}`);
  }
}

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'huntos',
    port: parseInt(process.env.DB_PORT) || 3306,
    ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 15000,
  });

  promisePool = pool.promise();

  // Test connection and initialize schema
  promisePool
    .query('SELECT 1')
    .then(async () => {
      isConnected = true;
      log('INFO', `HuntOS Database connected successfully [${process.env.DB_NAME || 'huntos'}]`);
      await runAutoMigrations(promisePool);
    })
    .catch((err) => {
      log('WARN', `MySQL connection unavailable: ${err.message}. Running in resilient mode.`);
    });
} catch (err) {
  log('WARN', `Failed to initialize MySQL pool: ${err.message}`);
}

const db = {
  query: async (...args) => {
    if (!promisePool) {
      throw new Error('Database pool is not initialized. Please check your DB credentials in .env');
    }
    return promisePool.query(...args);
  },
  isConnected: () => isConnected,
  getPool: () => promisePool,
};

module.exports = db;
