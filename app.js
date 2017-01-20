var TwitterPackage = require('twitter');
var Promise = require('promise');
var config = require('./config/config.js');
var lod = require('./lib/lod.js');


var Twitter = new TwitterPackage(config.twitter);





// Call the stream function and pass in 'statuses/filter', our filter object, and our callback
Twitter.stream('statuses/filter', {track: '@dauthadagr I need a hero'}, function(stream) {

  // ... when we get tweet data...
  stream.on('data', function(tweet) {

    // print out the text of the tweet that came in
    //console.log(tweet.text);

    //profile_image_url_https //user image

   //Make this a promise
   lod.createChar(tweet);

  });

  // ... when we get an error...
  stream.on('error', function(error) {
    //print out the error
    console.log(error);
  });
});


