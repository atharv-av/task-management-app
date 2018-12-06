const dbConnection = require("../dbConnection/dbConnection.js").dbConnection;
const Request = require("tedious").Request;

exports.getAllTasks = (res) => {
  const qry =
    "SELECT task_id, task_creation_dt, task_title, task_desc, task_completed, task_scheduled_dt, priority_desc " +
    "FROM tasks LEFT JOIN task_priorities ON tasks.priority_id = task_priorities.priority_id;";
  const request = new Request(qry, (err, rowCount, rows) => {
    if (err) {
      // need to inform user of error (ie send to client)?
      console.log(err);
    } else {
      // what if row count is zero?
      res.send(JSON.stringify(rows));
    }
  });

  dbConnection(request);
};
  