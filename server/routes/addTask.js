const dbConnection = require("../dbConnection/dbConnection.js");

module.exports = (req, res) => {
  const { orderByField } = req.params;
  const direction = req.params.direction === "Descending" ? "DESC" : "ASC";
  const orderBy =
    orderByField === "task_creation_dt"
      ? `${orderByField} ${direction}`
      : `${orderByField} ${direction} NULLS LAST, task_creation_dt DESC`;

  const client = dbConnection();

  // Create the tasks table if it doesn't exist
  client.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      task_id SERIAL PRIMARY KEY,
      task_creation_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      task_title TEXT NOT NULL,
      task_desc TEXT,
      task_completed BOOLEAN DEFAULT FALSE,
      task_scheduled_dt TIMESTAMP,
      priority_id INTEGER
    )
  `, (err) => {
    if (err) {
      console.error("Error creating tasks table:", err.stack);
      res.status(500).send("Error creating tasks table");
      return;
    }

    // Create the task_priorities table if it doesn't exist
    client.query(`
      CREATE TABLE IF NOT EXISTS task_priorities (
        priority_id SERIAL PRIMARY KEY,
        priority_desc TEXT
      )
    `, (err) => {
      if (err) {
        console.error("Error creating task_priorities table:", err.stack);
        res.status(500).send("Error creating task_priorities table");
        return;
      }

      // Execute the main query
      const qry = `
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

      client.query(qry, (err, qryResults) => {
        if (err) {
          console.error("Query execution failed:", err.stack);
          res.status(500).send("Error fetching tasks");
        } else {
          res.status(200).send(qryResults.rows);
        }
        client.end();
      });
    });
  });
};