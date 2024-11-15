const dbConnection = require("../dbConnection/dbConnection.js");

module.exports = (req, res) => {
  const { taskID } = req.params;

  if (!taskID) {
    return res.status(400).json({ error: "Task ID is required" });
  }

  const qry = `DELETE FROM tasks WHERE task_id = $1;`;

  const client = dbConnection();

  client.query(qry, [taskID], (err) => {
    client.end();
    if (err) {
      console.error("Deletion failed:", err.stack);
      return res.status(500).json({ error: "Failed to delete task" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  });
};
