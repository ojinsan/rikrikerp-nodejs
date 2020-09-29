const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");
const databaseRelation = require("./util/database-relation");

// MARK: Import routes and models
const datasourceRoute = require("./routes/datasource-route");
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
app.use("/data-source", datasourceRoute);

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

databaseRelation();

// MARK: Run it
sequelize
    .sync()
    .then((result) => {
        //console.log(result);
        app.listen(3000);
    })
    .catch((error) => {
        console.log(error);
    });
