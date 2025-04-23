const { Sequelize } = require("sequelize");
require("dotenv").config();

// Initialize Sequelize with PROD_DATABASE_URL from environment variables
const sequelize = new Sequelize(process.env.PROD_DATABASE_URL, {
  dialect: "postgres",
  dialectModule: require('pg'),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: console.log, // Log all SQL queries to console
  define: {
    freezeTableName: true, // Prevent Sequelize from pluralizing table names
  },
  pool: {
    max: 5, // Maximum number of connections in pool
    min: 0, // Minimum number of connections in pool
    acquire: 30000, // Max time in ms to acquire a connection before error
    idle: 10000, // Max time in ms a connection can be idle before release
  },
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Connected to PostgreSQL (Neon) successfully.");
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the database:", err);
  });

const db = {};
db.sequelize = sequelize;

module.exports = db;
