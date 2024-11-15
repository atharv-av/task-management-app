const dbConnection = require("../dbConnection/dbConnection.js");

function getQrySQL({ taskID, fieldName, newValue }) {
  if (fieldName === "priority_desc") {
    return {
      text: `
        CREATE TABLE IF NOT EXISTS task_priorities (
          priority_id SERIAL PRIMARY KEY,
          priority_desc TEXT
        );

        UPDATE tasks SET priority_id = 
          (SELECT priority_id 
           FROM task_priorities 
           WHERE priority_desc = $1) 
        WHERE tasks.task_id = $2;
      `,
      values: [newValue, taskID],
    };
  } else if (fieldName === "task_scheduled_dt" && newValue === "null") {
    return {
      text: `
        CREATE TABLE IF NOT EXISTS tasks (
          task_id SERIAL PRIMARY KEY,
          task_creation_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          task_title TEXT NOT NULL,
          task_desc TEXT,
          task_completed BOOLEAN DEFAULT FALSE,
          task_scheduled_dt TIMESTAMP,
          priority_id INTEGER
        );

        UPDATE tasks SET ${fieldName} = NULL WHERE task_id = $1;
      `,
      values: [taskID],
    };
  } else {
    return {
      text: `
        CREATE TABLE IF NOT EXISTS tasks (
          task_id SERIAL PRIMARY KEY,
          task_creation_dt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          task_title TEXT NOT NULL,
          task_desc TEXT,
          task_completed BOOLEAN DEFAULT FALSE,
          task_scheduled_dt TIMESTAMP,
          priority_id INTEGER
        );

        UPDATE tasks SET ${fieldName} = $1 WHERE task_id = $2;
      `,
      values: [newValue === "null" ? null : newValue, taskID],
    };
  }
}

module.exports = (req, res) => {
  const qry = getQrySQL(req.params);

  const client = dbConnection();

  client.query(qry.text, qry.values, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating task" });
    } else {
      res.sendStatus(200);
    }
    client.end();
  });
};