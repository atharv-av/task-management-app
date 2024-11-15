const dbConnection = require("../dbConnection/dbConnection.js");

module.exports = (req, res) => {
  const { taskTitle } = req.body;

  if (!taskTitle) {
    return res.status(400).json({ error: "Task title is required" });
  }

  const qry = `INSERT INTO tasks (task_title, task_desc) VALUES ($1, '') RETURNING *;`;

  const client = dbConnection();

  client.query(qry, [taskTitle], (err, result) => {
    client.end();
    if (err) {
      console.error("Query execution failed:", err.stack);
      return res.status(500).json({ error: "Failed to add task" });
    }
    res.status(201).json(result.rows[0]);
  });
};
