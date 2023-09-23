const ajv = require('ajv');
const recordschema = require('../schema/recordSchema.json');
const validinput = new ajv();
const fs = require('fs');

const async = require('async');


var queue = async.queue(function (event, callback) {
    if (callback) callback();
    let part = getPartition(event.timestamp);

    if (!fs.existsSync('./records/' + part)) {
        fs.mkdirSync('./records/' + part);
    }
    let fileName = frameFileName(event.timestamp);
    if (!fs.existsSync('./records/' + part + "/" + fileName)) {
        fs.writeFileSync('./records/' + part + "/" + fileName, '');
    }
    fs.appendFileSync('./records/' + part + "/" + fileName, createRow(event));
}, 1);

exports.searchCall = (req, res, next) => {
    let start = req.body.start;
    let end = req.body.end;
    let isMore = false;
    let nextIndex = -1;

    let currentTime = Date.now();
    // validation
    if (start > end || start < currentTime - (1000 * 60 * 360) || end > currentTime) {
        res.json({
            success: false,
            error: {
                code: 400,
                message: "Not a valid datetime range"
            }
        });
    } else if (end - start > (1000 * 60 * 30)) { // > 30 mins range
        res.json({
            success: false,
            error: {
                code: 400,
                message: "Search duration range not supported"
            }
        });
    } else {
        let startFile = parseInt(start / 1000);
        let endFile = parseInt(end / 1000);
        let startLineMarker = start % 1000;
        let endLineMarker = end % 1000;
        let lines = [];
        for (let i = startFile; i <= endFile; i++) {
            let folder = getPartition(i * 1000);
            //console.log('./records/' + folder + "/" + i + ".txt");
            if (fs.existsSync('./records/' + folder + "/" + i + ".txt")) {
                //console.log('./records/' + folder + "/" + i + ".txt");
                let content = fs.readFileSync('./records/' + folder + "/" + i + ".txt").toString();
                content.split("\n").forEach((line) => {
                    let tokens = line.split("|");
                    if (line.length > 0 && parseInt(tokens[0]) >= startLineMarker) {
                        if(i != endFile){
                            lines.push({ id: tokens[2], timestamp: tokens[1], message: tokens[3] });
                        }else if(tokens[0] < endLineMarker){
                            lines.push({ id: tokens[2], timestamp: tokens[1], message: tokens[3] });
                        }
                    }else{
                        console.log(tokens[0], startLineMarker);
                    }
                });
            }
            startLineMarker = 0;
            if (lines.length > 10000) {
                isMore = true;
                nextIndex = i + 1;
                break;
            }
        }
        
        res.json({
            success: true,
            result: lines,
            hasMoreRecords: isMore,
            nextIndex: nextIndex,
            count: lines.length
        });
    }
};

exports.createCall = (req, res, next) => {
    //console.log("record", req.body);
    let recordIn = req.body;
    // ajv validation
    const validate = validinput.compile(recordschema);
    const valid = validate(recordIn);
    //console.log(valid);
    if (!valid) {
        console.log(validate.errors);
        res.json({
            success: false,
            errorMessage: validate.errors
        });
        return;
    }

    //save to file
    writeToFile(recordIn);
    res.json({
        success: true,
        message: "record accepted"
    });
};

let writeToFile = (json) => {
    queue.push(json);
}

let getPartition = (timestamp) => {
    let date = new Date(timestamp);
    return parseInt(date.getMinutes() / 5);
}

let frameFileName = (timestamp) => {
    let timeInMinutes = parseInt(timestamp / 1000);
    return timeInMinutes + ".txt";
}

let createRow = (json) => {
    let milliSecs = json.timestamp % 1000;
    return milliSecs + "|" + json.id + "|" + json.timestamp + "|" + json.message + "\n";
}