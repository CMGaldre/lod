
var Twitter = require('twitter');
var config = require('../config/config.js');
var Promise = require('promise');
var Jimp = require("jimp");
var PNG = require("pngjs").PNG;
var Roll = require('roll');
var diceRoll = new Roll();
var client = new Twitter(config.twitter);
var lod = {};



lod.hides;
lod.weapons;
lod.names;
lod.titles;
lod.features;
lod.locations;


//open connection
     config.con.connect(function(err){
      if(err){
        console.log('Error connecting to Db');
        console.log(err);
        reject(err);
      }
      console.log('Connection established');
      lod.loadData().then(function(){

      	//create test card
      	lod.createChar("a tweet");

      });
    });



lod.loadData = function(){

	//return a promise
	 return new Promise(function(resolve, reject) {

	//Our data is relatively small and we don't want to hit the DB each time to generate a character so we load the DB
	//data in to arrays saved on the server.

	var names = lod.loadNames();
	var features = lod.loadFeatures();
	var locations = lod.loadLocations();
	var hides = lod.loadHides();
	var weapons = lod.loadWeapons();

	//divided into promises to make sure they are loaded before resolving
		Promise.all([names, features, locations, hides, weapons]).then(function(results) {


		  resolve("loaded");

		})
		.catch(function(error) {
			// One or more promises was rejected
			reject("missing data");
		});


			
	});

};

lod.loadFeatures = function(){
return new Promise(function(resolve, reject) {
	var request = 'SELECT * FROM feature';

			config.con.query(request ,function(err,rows){
			  if(err) throw err;

			  lod.features=rows;
			  console.log('features loaded');
			  resolve('features loaded');
			});
	});
};

lod.loadLocations = function(){
return new Promise(function(resolve,reject){  

var request = 'Select * from location';

			config.con.query(request ,function(err,rows){
			  if(err) throw err;

			  lod.locations=rows;
			  console.log('locations loaded');
			  resolve('locations loaded');
			});
	});
};

lod.loadHides = function(){

return new Promise(function(resolve, reject){

	var request = 'Select * from hide';

			config.con.query(request ,function(err,rows){
			  if(err) throw err;

			  lod.hides=rows;
			  console.log('hide subtypes loaded');
			  resolve('hide subtypes loaded');

			});

	});
};

lod.loadWeapons = function(){
return new Promise(function(resolve,reject){ 

	var request = 'Select * from weapon';

			config.con.query(request ,function(err,rows){
			  if(err) throw err;

			  lod.weapons=rows;
			  console.log('weapon subtypes loaded');
			  resolve('weapon subtypes loaded')
			});

});


};

lod.loadNames = function(){
return new Promise(function(resolve,reject){

		request = 'Select * from heroes';

			config.con.query(request ,function(err,rows){
			  if(err) throw err;

			  lod.names=rows;
			  console.log('hero names loaded');
			  resolve("hero names loaded");
			});

	});

}




lod.generateFeature = function(){

	//return a promise
	 return new Promise(function(resolve, reject) {


	 		  var dice = "d"+(lod.features.length);
	 
			  var feature = lod.features[diceRoll.roll(dice).result-1];

			  dice = "d"+(lod.locations.length);

			  var location = lod.locations[diceRoll.roll(dice).result-1]

			 var currFeature = "";

			
			  if (feature.subtype >0)
			  {
			  	
			  	getSubtype(feature.subtype).then(function(result){


			  		currFeature = result+' '+feature.name+" "+location.name;
			  		resolve(currFeature);

			  	});
			  }

			  else
			  {
			  	currFeature = feature.name+" "+location.name;
			  	resolve(currFeature);
			  }	  

			});
	};



//Get a subtype
function getSubtype(subtype){

	return new Promise(function(resolve, reject) {


		switch(subtype) {
    case 1:
        
		  var dice = "d"+(lod.weapons.length);
	  	  var subfeature = lod.weapons[diceRoll.roll(dice).result-1];

	  	  resolve(subfeature.description);

        break;
    case 2:
        
		  var dice = "d"+(lod.hides.length);
	  	  var subfeature = lod.hides[diceRoll.roll(dice).result-1];

	  	  resolve(subfeature.description);
        break;
    default: resolve(" ");
	}



	}).catch(function(error) {
			// One or more promises was rejected
			console.log(error);
		});

}

function getName()
{

	return new Promise(function(resolve, reject) {	

	
		var dice = "d"+(lod.names.length);
	  	var hero= lod.names[diceRoll.roll(dice).result-1];

	  	resolve(hero.name);	  	
	 	}); 
}

function getIcon(text)
{
	return new Promise(function(resolve, reject) {	

	var path = "./img/";

	
	if (text.includes("Gashed"))
	{
		path = path + "gashed.png";
	}
	else if (text.includes("Torn"))
	{
		path = path + "torn.png";
	}
	else if (text.includes("Burned"))	
	{
		path = path + "burned.png";
	}
	else if (text.includes("Wooden"))
	{
		path = path + "wooden.png";
	}
	else if (text.includes("Iron"))
	{ path = path + "iron.png";}
	else if (text.includes("Bone")){ path = path + "bone.png";}
	else if (text.includes("Embedded")){ path = path + "embedded.png";}
	else if (text.includes("Hide")){ path = path + "hide.png";}
	else if (text.includes("Runic")){ path = path + "runic.png";}
	else if (text.includes("Gemmed")){ path = path + "gemmed.png";}
	else if (text.includes("Spiked")){ path = path + "spiked.png";}
	else
	{
		path = path + "missing.png";
	}

	console.log(path);

	

	Jimp.read(path).then(function (image) {

		resolve(image);
	});

});
	
}


function generateCard(text, tweet)
{
	

		var cardText = text;

		console.log('card started');


Jimp.read("./img/CardTemplate-01.png").then(function (image) {
    // do stuff with the image 

    Jimp.loadFont("./fonts/linuxlibertine-black-ipad.fnt").then(function (font) {

    image.print(font, 194, 500, cardText[1]);
    image.print(font, 194, 590, cardText[2]);  
    image.print(font, 194, 680, cardText[3]);
    image.print(font, 194, 770, cardText[4]);
    image.print(font, 194, 860, cardText[5]);
    image.print(font, 194, 950, cardText[6]);
    



    var icons = new Array;


    icons.push(getIcon(cardText[1]).then(function (icon){
    	image.composite( icon, 95, 500 );
    }));

    icons.push(getIcon(cardText[2]).then(function (icon){
    	 image.composite( icon, 95, 590 ); 
    }));

    icons.push(getIcon(cardText[3]).then(function (icon){
    	image.composite( icon, 95, 675 );
    }));
    
    icons.push(getIcon(cardText[4]).then(function (icon){
    	 image.composite( icon, 95, 765 );
    }));
    icons.push(getIcon(cardText[5]).then(function (icon){
    	 image.composite( icon, 95, 855 );
    }));
    icons.push(getIcon(cardText[6]).then(function (icon){
    	 image.composite( icon, 95, 940 ); 
    }));




    Promise.all(icons).then(function() {


		Jimp.loadFont("./fonts/linuxlibertine-white-ipadhd.fnt").then(function (font2) {

		image.print(font2, 400, 100, cardText[0]);


		var cardName = guidGenerator();
		var path = './img/gen/'+cardName+'.png';
		
		image.write('./img/gen/'+cardName+'.png', function(result){ 
			console.log("card generated");

			//Twitter Bit
			var data = require('fs').readFileSync(path);

		// Make post request on media endpoint. Pass file data as media parameter
		client.post('media/upload', {media: data}, function(error, media, response) {

		   console.log(response);
		   console.log(error);

	  if (!error) {

	    // If successful, a media object will be returned.
	    console.log(media);

	 

	    console.log("success!");




    //build our reply object
    var statusObj = {status: "@" + tweet.user.screen_name + " Testing!",  media_ids: media.media_id_string}

    //call the post function to tweet something
 

	client.post('statuses/update', statusObj, function(error, tweet, response) {
	      
	         console.log(response);
	         console.log(error);

	      if (!error) {
	        console.log(tweet);
	      }
	    });
	    	  
		}

	});
			
		//Twitter Bit

		});; 	

	});

	});




 

	});

});


};



function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}



//function to create character
lod.createChar= function(tweet){


		console.log("character started");

   //Character Creation
  //Create 6 Features by first rolling the feature type then a location and any subtypes

  		var feature1 = lod.generateFeature();
  		var feature2 = lod.generateFeature();
  		var feature3 = lod.generateFeature();
  		var feature4 = lod.generateFeature();
  		var feature5 = lod.generateFeature();
  		var feature6 = lod.generateFeature();
  		var name = getName();


  	Promise.all([name, feature1, feature2, feature3, feature4, feature5, feature6]).then(function(results) {

		 console.log(results);

		  generateCard(results, tweet);

		})
		.catch(function(error) {
			// One or more promises was rejected
			console.log(error);
		});


};


module.exports = lod;



