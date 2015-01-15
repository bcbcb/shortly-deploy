var mongoose = require('mongoose');
var path = require('path');

mongoose.connect('mongodb://localhost/test');

var Schema = mongoose.Schema;

module.exports.urlSchema = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0}
});

module.exports.userSchema = new Schema({
  username: String,
  password: String
});
