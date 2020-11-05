const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");
const databaseRelation = require("./util/database-relation");

// MARK: Import routes and models
const datasourceRoute = require("./routes/datasource-route");
const baseRoute = require("./routes/base-route");
const projectRoute = require("./routes/project-route");
const excelRoute = require("./routes/excel-route");

const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json()); // application/json

// MARK: validate the request
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// MARK: Routes usage, check out the /blablabla
app.use("/project", projectRoute);
app.use("/data-source", datasourceRoute);
app.use("/base", baseRoute);
app.use("/excel", excelRoute);

// MARK: Routes usage, default condition
// MARK: No Routes Found or App Error
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

// MARK: Crate each Relation
databaseRelation();

// MARK: Run it when database is ready
sequelize
  .sync()
  .then((result) => {
    console.log("hehe");
    app.listen(3000);
  })
  .catch((error) => {
    console.log(error);
  });
