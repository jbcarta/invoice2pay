/**
 * Module dependencies
 */

var express = require('express');
var fs = require('fs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// img path
var imgPath = '/path/to/some/img.png';

// connect to mongo
mongoose.connect('localhost', 'testing_storeImg');

// example schema
var schema = new Schema({
    img: { data: Buffer, contentType: String }
});

// our model
var A = mongoose.model('A', schema);

mongoose.connection.on('open', function () {
  console.error('mongo is open');

  // empty the collection
  A.remove(function (err) {
    if (err) throw err;

    console.error('removed old docs');

    // store an img in binary in mongo
    var a = new A;
    a.img.data = fs.readFileSync(imgPath);
    a.img.contentType = 'image/png';
    a.save(function (err, a) {
      if (err) throw err;

      console.error('saved img to mongo');

      // start a demo server
      var server = express.createServer();
      server.get('/', function (req, res, next) {
        A.findById(a, function (err, doc) {
          if (err) return next(err);
          res.contentType(doc.img.contentType);
          res.send(doc.img.data);
        });
      });

      server.on('close', function () {
        console.error('dropping db');
        mongoose.connection.db.dropDatabase(function () {
          console.error('closing db connection');
          mongoose.connection.close();
        });
      });


    // Loads mikeal/request Node.js library.
    var request = require('request');

    // Specify the encoding (the important is to keep the same when creating the buffer, after)
    // If you only give the URL, it brakes the downloaded data, I didn't found an other way to do it.
    request({
          url: 'http://www.cedynamix.fr/wp-content/uploads/Tux/Tux-G2.png',
          encoding: 'binary'
        }, function(error, response, body) {
          if (!error && response.statusCode === 200) {
             body = new Buffer(body, 'binary');

             // Here "body" can be affected to the "a.img.data"
             // var a = new A;
             // a.img.data = body;
             // ....
          }
     });      

      server.listen(3333, function (err) {
        var address = server.address();
        console.error('server listening on http://%s:%d', address.address, address.port);
        console.error('press CTRL+C to exit');
      });

      process.on('SIGINT', function () {
        server.close();
      });
    });
  });

});