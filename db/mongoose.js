var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(
  'mongodb+srv://prashanthdussa:dussa2000@home-rentals.ypnzy.mongodb.net/users?retryWrites=true&w=majority'
);

module.exports = { mongoose };
