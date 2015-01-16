var mongoose = require('mongoose');
var urlSchema = require('../config').urlSchema;
var crypto = require('crypto');

var Link = mongoose.model('Link', urlSchema);

urlSchema.pre('save', function(next){
  var url = this;
  var shasum = crypto.createHash('sha1');
  shasum.update(url.url);
  url.code = shasum.digest('hex').slice(0, 5);
  next();
});

module.exports = Link;
