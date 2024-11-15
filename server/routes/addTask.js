const dbConnection = require("../dbConnection/dbConnection.js");

module.exports = (req, res) => {
  const { taskTitle } = req.params;

  const qry = `
    CREATE TABLE IF NOT EXISTS tasks (
      task_id SERIAL PRIMARY KEY,
      task_creation_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      task_title TEXT NOT NULL,
      task_desc TEXT,
      task_completed BOOLEAN DEFAULT FALSE,
      task_scheduled_dt TIMESTAMP,
      priority_id INTEGER
    );

    INSERT INTO tasks (task_title, task_desc) VALUES ($1, '');
  `;

  const client = dbConnection();

  client.query(qry, [taskTitle], (err) => {
    if (err) {
      console.error("Query execution failed:", err.stack);
      res.status(500).send("Error adding task");
    } else {
      res.sendStatus(200);
    }
    client.end();
  });
};