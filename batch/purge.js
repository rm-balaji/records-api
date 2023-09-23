const fs = require('fs');

exports.purgeRecords = ()=>{
    let currentTimeStamp = Date.now();
    let purgeWindowStart = currentTimeStamp - 1000 * 60 * 37;
    let purgeWindowEnd = currentTimeStamp - 1000 * 60 * 30;
    purgeWindowStart = parseInt(purgeWindowStart / 1000);
    purgeWindowEnd = parseInt(purgeWindowEnd / 1000);
    console.log('purge window ', purgeWindowStart, purgeWindowEnd);
    let fileNames = [];
    for (let i = purgeWindowStart; i < purgeWindowEnd; i++) {
        let prefix = i+ "";
        let part = prefix.substring(prefix.length - 1);
        let folder = getPartition(i * 1000);
        if (fs.existsSync('./records/' + folder + "/" + i + ".txt")) {
            fileNames.push('./records/' + folder + "/" + i + ".txt")
        }
    }

    fileNames.forEach((fullName) => {
        fs.unlinkSync(fullName);
    });
    console.log('purge complete ');
};

let getPartition = (timestamp) => {
    let date = new Date(timestamp);
    return parseInt(date.getMinutes() / 5);
}

let frameFileName = (timestamp) => {
    let timeInMinutes = parseInt(timestamp / 1000);
    return timeInMinutes + ".txt";
}
