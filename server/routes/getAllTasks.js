const dbConnection = require("../dbConnection/dbConnection.js");

module.exports = (req, res) => {
  const { orderByField } = req.params;
  const direction = req.params.direction === "Descending" ? "DESC" : "ASC";
  const orderBy =
    orderByField === "task_creation_dt"
      ? `${orderByField} ${direction}`
      : `${orderByField} ${direction} NULLS LAST, task_creation_dt DESC`;

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

    CREATE TABLE IF NOT EXISTS task_priorities (
      priority_id SERIAL PRIMARY KEY,
      priority_desc TEXT
    );

    SELECT task_id, 
           task_creation_dt, 
           task_title, 
           task_desc, 
           task_completed, 
           task_scheduled_dt, 
           priority_desc
    FROM tasks
    LEFT JOIN task_priorities ON tasks.priority_id = task_priorities.priority_id
    ORDER BY ${orderBy};
  `;

  const client = dbConnection();

  client.query(qry, (err, qryResults) => {
    if (err) {
      console.error("Query execution failed:", err.stack);
      res.status(500).send("Error fetching tasks");
    } else {
      res.status(200).send(qryResults.rows);
    }
    client.end();
  });
};