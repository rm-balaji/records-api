const fs = require('fs');

exports.purgeRecords = ()=>{
    let currentTimeStamp = Date.now();
    let purgeWindowStart = currentTimeStamp - 1000 * 60 * 35;
    let purgeWindowEnd = currentTimeStamp - 1000 * 60 * 30;

    for (let i = purgeWindowStart; i < purgeWindowEnd; i++) {
        let prefix = i+ "";
        let part = prefix.substring(prefix.length - 1);
        fs.readdirSync('./records/' + part + "/").forEach(file => {
            console.log(file);
            if (file.startsWith(prefix)) {
                fileNames.push('./records/' + part + "/" + file);
            }
        });
    }

    fileNames.forEach((fullName) => {
        fs.unlinkSync(fullName);
    });
};