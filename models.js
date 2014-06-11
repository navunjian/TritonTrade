var Mongoose = require('mongoose');

var PostSchema = new Mongoose.Schema({
  "title": String,
  "tags": String,
  "itemaction": String,
  "condition": String,
  "price": String,
  "description": String
});


exports.Post = Mongoose.model('Post', JobSchema);

