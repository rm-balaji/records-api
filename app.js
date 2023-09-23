const express = require("express");
const recordRoute=require('./routes/record');

const app = express();
module.exports = app;

app.use(express.json());
app.get("/", (req, res, next) => {
    res.json({
        "message": "hello world"
    });
});
app.use("/record",recordRoute);

