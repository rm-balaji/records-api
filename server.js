const http = require("http");
const mongoose  = require("mongoose");
const app = require("./app");
const server = http.createServer(app);
const purge = require("./batch/purge");
console.log("server start timestamp :: ", Date.now())
setInterval(purge.purgeRecords, 1000 * 60 * 30);

server.listen(3000);

