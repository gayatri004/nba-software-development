const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "faculty_db",
  password: "12345",
  port: 5432,
});

pool.connect()
  .then((client) => {
    console.log("✅ Local PostgreSQL Connected Successfully");
    client.release();
  })
  .catch((err) => {
    console.error("❌ Database Error:", err);
  });

module.exports = pool;