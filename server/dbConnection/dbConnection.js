const Connection = require("tedious").Connection;

const config = {
  userName: "ross_wr_54",
  password: "k32!IW0Nm@HG",
  server: "tasksappserver.database.windows.net",
  options: {
    database: "tasksAppDatabase",
    encrypt: true,
    rowCollectionOnRequestCompletion: true
  }
};

exports.dbConnection = () => {

  const connection = new Connection(config);

  return connection;
};