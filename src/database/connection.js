const Sequelize = require("sequelize");
require("dotenv").config(); // Load environment variables from .env file

// Initialize Sequelize with DATABASE_URL from environment variables
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: console.log, // Log all SQL queries to console
  freezeTableName: true, // Prevent Sequelize from pluralizing table names
  pool: {
    max: 5, // Maximum number of connection in pool
    min: 0, // Minimum number of connection in pool
    acquire: 30000, // Maximum time, in milliseconds, that pool will try to get connection before throwing error
    idle: 10000, // Maximum time, in milliseconds, that a connection can be idle before being released
  },
});

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

const db = {};
db.sequelize = sequelize;

module.exports = db;
