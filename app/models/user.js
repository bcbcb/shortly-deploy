var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');
var userSchema = require('../config').userSchema;

var User = mongoose.model('User', userSchema);

userSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) {
    return next();
  }

  var cipher = Promise.promisify(bcrypt.hash);

  cipher(user.password, null, null)
    .then(function(hash) {
      user.password = hash;
      next();
    });

});

User.comparePassword = function(attemptedPassword, realPassword, callback) {
  bcrypt.compare(attemptedPassword, realPassword, function(err, isMatch) {
    callback(isMatch);
  });
};

module.exports = User;
