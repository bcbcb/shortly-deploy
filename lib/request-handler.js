var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find({},function(err, docs){
    res.send(200, docs);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  Link.find({url: uri}, function(err, docs){
    if(!docs.length){
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        Link.create({
          url: uri,
          title: title,
          base_url: req.headers.origin
        },
          function (err, createdLink) {
            console.log(createdLink);
            res.send(200, createdLink);
          });
      });
    } else {
      res.send(200, docs[0]);
    }

  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({username: username}, function(err, docs){
    if(!docs.length){
      res.redirect('/login');
    }else{
      User.comparePassword(password, docs[0].password, function(match){
        if (match) {
          util.createSession(req, res, docs);
        } else {
          res.redirect('/login');
        }
      });
    }
  });

};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({username: username}, function(err, docs){
    if(!docs.length){
      var newUser = User.create({
        username: username,
        password:  password
      });
      console.log(newUser);
      util.createSession(req, res, newUser);

    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }

  });

};


exports.navToLink = function(req, res) {
  Link.find({ code: req.params[0] }, function (err, docs) {
    var link = docs[0];
    console.log(link);
    if (!link) {
      res.redirect('/');
    }
    else {
      link.visits = link.visits + 1;
      link.save();
      return res.redirect(link.url);
    }
  });

};
