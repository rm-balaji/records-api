const express = require('express');
const route = express.Router();
const recordService = require("../service/recordService.js");

module.exports = route;


/**
 * get all in a timestamp
 */
route.post("/get", recordService.searchCall);


/**
 * create
 */
route.post("/", recordService.createCall);