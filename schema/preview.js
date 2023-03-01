const mongoose = require("mongoose")
var moment = require("moment");
const postSchema = mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  imageUrl: {
    imageUrl: { type: String },
    public_id: { type: String, required: true },
  },
  date: { type: Date, default: Date.now()},
  description: String,
});



    
const previewSchema = mongoose.model("previewSchema",postSchema)
module.exports=previewSchema