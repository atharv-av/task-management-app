const { Client } = require("pg");

module.exports = () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required for NeonDB
    },
  });

  console.log("Attempting to connect to NeonDB...");
  console.log("Database connection string:", process.env.DATABASE_URL);

  client.connect((err) => {
    if (err) {
      console.error("Error connecting to NeonDB:", err.message);
    } else {
      console.log("Connected to NeonDB successfully!");
    }
  });

  return client;
};