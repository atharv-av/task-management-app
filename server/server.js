const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const getAllTasks = require("./routes/getAllTasks.js");
const addTask = require("./routes/addTask.js");
const amendTask = require("./routes/amendTask.js");
const deleteTask = require("./routes/deleteTask.js");

const port = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors());

// Routes
app.get("/allTasks", getAllTasks);
app.post("/addTask", addTask);
app.put("/amendTask", amendTask);
app.delete("/deleteTask/:taskID", deleteTask);

// Serve client files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(__dirname, "../client/build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
