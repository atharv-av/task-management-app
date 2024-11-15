const dbConnection = require("../dbConnection/dbConnection.js");

const getQrySQL = ({ taskID, fieldName, newValue }) => {
  const allowedFields = ['task_title', 'task_desc', 'task_completed', 'task_scheduled_dt', 'priority_id'];
  if (!allowedFields.includes(fieldName)) {
    return { text: '', values: [] }; // Return empty query if the field is not allowed
  }

  return {
    text: `
      UPDATE tasks SET ${fieldName} = $1 WHERE task_id = $2;
    `,
    values: [newValue === "null" ? null : newValue, taskID],
  };
};

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