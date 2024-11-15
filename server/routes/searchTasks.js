const dbConnection = require("../dbConnection/dbConnection.js");

module.exports = (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: "Task title query parameter is required" });
  }

  const qry = `
    SELECT * FROM tasks
    WHERE LOWER(task_title) LIKE LOWER($1)
    ORDER BY task_creation_dt DESC;
  `;

  const client = dbConnection();

  client.query(qry, [`%${title}%`], (err, results) => {
    client.end();
    if (err) {
      console.error("Search query failed:", err.stack);
      return res.status(500).json({ error: "Failed to search tasks" });
    }
    res.status(200).json(results.rows);
  });
};
