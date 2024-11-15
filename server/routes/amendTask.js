const dbConnection = require("../dbConnection/dbConnection.js");

module.exports = (req, res) => {
  const { taskID, fieldName, newValue } = req.body;

  if (!taskID || !fieldName) {
    return res.status(400).json({ error: "taskID and fieldName are required" });
  }

  const qry =
    fieldName === "priority_desc"
      ? {
          text: `UPDATE tasks SET priority_id = (SELECT priority_id FROM task_priorities WHERE priority_desc = $1) WHERE task_id = $2;`,
          values: [newValue, taskID],
        }
      : {
          text: `UPDATE tasks SET ${fieldName} = $1 WHERE task_id = $2;`,
          values: [newValue === "null" ? null : newValue, taskID],
        };

  const client = dbConnection();

  client.query(qry.text, qry.values, (err) => {
    client.end();
    if (err) {
      console.error("Update failed:", err.stack);
      return res.status(500).json({ error: "Failed to update task" });
    }
    res.status(200).json({ message: "Task updated successfully" });
  });
};
