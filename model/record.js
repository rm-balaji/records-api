const mongoose = require("mongoose");

const recordschema=mongoose.Schema({
    id: { type: String, required: true },
    timestamp: { type: String, required: true },
    message: { type: String, required: true ,unique: true}
});
module.exports=mongoose.model("Record", recordschema);