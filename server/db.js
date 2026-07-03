const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "faculty_db",
  password: process.env.DB_PASSWORD || "12345",
  port: Number(process.env.DB_PORT) || 5432,
});

// Test connection
pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected Successfully"))
  .catch((err) => console.error("❌ Database Error:", err));

module.exports = pool;