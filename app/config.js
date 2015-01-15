var mongoose = require('mongoose');
var path = require('path');

mongoose.connect('mongodb://localhost/test');

var Schema = mongoose.Schema;

modules.exports.urlSchema = new Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0}
});

modules.

modules.exports.userSchema = new Schema({
  username: String,
  password: String
});
