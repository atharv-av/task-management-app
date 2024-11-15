const dbConnection = require("../dbConnection/dbConnection.js");

module.exports = (req, res) => {
  const { taskID } = req.params;

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

    DELETE FROM tasks WHERE task_id = $1;
  `;

  const client = dbConnection();

  client.query(qry, [taskID], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting task" });
    } else {
      res.sendStatus(200);
    }
    client.end();
  });
};