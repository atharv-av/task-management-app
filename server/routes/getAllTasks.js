const dbConnection = require("../dbConnection/dbConnection.js");

module.exports = (req, res) => {
  const { orderByField = "task_creation_dt", direction = "ASC", newTask = false } = req.query;
  const directionSQL = direction === "Descending" ? "DESC" : "ASC";
  const orderBySQL =
    orderByField === "task_creation_dt"
      ? `${orderByField} ${directionSQL}`
      : `${orderByField} ${directionSQL} NULLS LAST, task_creation_dt DESC`;

  const qry = newTask === "true"
    ? `
        (SELECT * FROM tasks ORDER BY task_creation_dt DESC LIMIT 1)
        UNION ALL
        (SELECT * FROM tasks WHERE task_creation_dt <> (SELECT MAX(task_creation_dt) FROM tasks) ORDER BY ${orderBySQL})
      `
    : `SELECT * FROM tasks ORDER BY ${orderBySQL};`;

  const client = dbConnection();

  client.query(qry, (err, results) => {
    client.end();
    if (err) {
      console.error("Query failed:", err.stack);
      return res.status(500).json({ error: "Failed to retrieve tasks" });
    }
    res.status(200).json(results.rows);
  });
};
