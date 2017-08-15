var express = require('express');
var bodyParser = require('body-parser');
var geolib = require('geolib');
//----------------------------------------------------------------------------------------------
//Innen indul a mobil(REST) app

//BASE SETUP

var app2 = express();
app2.use(bodyParser());
app2.set('view engine', 'jade');

var port = process.env.PORT || 8080; 		// set our port
//DB connection
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/spatial'); // connect to our database

var User     = require('./models/user');
var Calendar = require('./models/calendar');
var Eventt = require('./models/event'); //Event is default variable
var Place = require('./models/place');
var City = require('./models/city');
var Country = require('./models/country');
var River = require('./models/river');
var Pont = require('./models/pont');
var Pontok = require('./models/pontok');
var WaterWay = require('./models/waterway');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// REST commands, middleware

router.route('/users')

	// create a user (accessed at POST http://localhost:8080/api/users)
	.post(function(req, res) {
            if (typeof req.body._id !== 'undefined') {
		User.findById(req.body._id, function(err, user) {
			if (err)
				res.send(err);
			if (!user) {					
				var user = new User(); 		// create a new instance of the User model
				user._id = req.body._id;  // set the users name (comes from the request)
				user.pass = req.body.pass;
				user.email = req.body.email;

				// save the user and check for errors
				user.save(function(err) {
					if (err)
						res.send(err);

					res.json({ message: 'User created!' });
					console.log('User created');
				});
			} else {
				res.send("This username is existing");
			}
		});			
	    } else {
				res.send("The username is undefined");
			}
	})

.get(function(req, res) {
		User.find(function(err, users) {
			if (err)
				res.send(err);

			res.json(users);
		});
	});

// Adott id-ju user lekérdezese
// =============================================================================
router.route('/users/:user_id')

	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err)
				res.send(err);
			res.json(user);
		});	
      
	})

	.put(function(req, res) {

		User.findById(req.params.user_id, function(err, user) {

			if (err)
				res.send(err);

			if (typeof req.body.pass !== 'undefined') {
                                user.pass = req.body.pass;
                        }
			if (typeof req.body.email !== 'undefined') {
                                user.email = req.body.email;
                  	}
			if (typeof req.body.public_events !== 'undefined') {
				var events = new Array();
				events = req.body.public_events.split(",");
				console.log(events);
                                User.update( { _id: req.params.user_id  } ,
                                {
					$pushAll: {
			        	public_events: events
				}},  function(err, user) {
		                	if (err)
		                        	res.send(err);
			                res.json({ message: 'Successfully pushed' });
		                });
                  	}
			if (typeof req.body.remove_event !== 'undefined') {
                                User.update( { _id: req.params.user_id  } ,
                                {
					$pull: {
			        	public_events: req.body.remove_event
				}},  function(err, user) {
		                	if (err)
		                        	res.send(err);
			                res.json({ message: 'Successfully pushed' });
		                });
                  	}

			user.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'User updated!' });
			});

		});
		if (req.body.event_id !== 'undefined') {
                    User.update( { _id: req.params.user_id  } ,
                                {
	        	$push: {
        	        	public_events: req.body.event_id
	        	}},  function(err, user) {
                        	if (err)
                                	res.send(err);
	                        res.json({ message: 'Successfully pushed' });
                        });
                }

	})

	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

router.route('/calendars')

        .post(function(req, res) {
            if (typeof req.body.uid !== 'undefined') {
                var calendar = new Calendar();
                calendar.uid = req.body.uid; 
		calendar.from = req.body.from;
		calendar.to = req.body.to;
		calendar.name= req.body.name;
		calendar.place = { type: 'Point', coordinates: req.body.coordinates };

                calendar.save(function(err) {
                        if (err)
                                res.send(err);

                        res.json({ message: 'Calendar created!' });
                });
	    } else {
		res.send("The calendar id is undefined");
	    }
        })

.get(function(req, res) {
                Calendar.find(function(err, calendars) {
                        if (err)
                                res.send(err);

                        res.json(calendars);
                });
        });

router.route('/calendars/:calendaruid')

        .get(function(req, res) {
		Calendar.find({uid: req.params.calendaruid}, function (err, calendar) {
			if (err)
				res.send(err);
			res.json(calendar);
		});
        })
	.put(function(req, res) {

                Calendar.findById(req.params.calendaruid, function(err, calendar) {

                        if (err)
                                res.send(err);
                        if (typeof req.body.from !== 'undefined') {
                                calendar.from = req.body.from; 
                        }
			if (typeof req.body.to !== 'undefined') {
				calendar.to = req.body.to;
			}
			if (typeof req.body.name !== 'undefined') {
                                calendar.name = req.body.name;
                        }
			/*if (typeof req.body.uid !== 'undefined') {
                                calendar.uid = req.body.uid;
                        }*/

                        if (typeof req.body.coordinates !== 'undefined') {
                                calendar.place = { type: 'Point', coordinates: req.body.coordinates };
                        }

                        calendar.save(function(err) {
                                if (err)
                                        res.send(err);

                                res.json({ message: 'Calendar updated!' });
                        });

                });

        })
	.delete(function(req, res) {
		Calendar.remove({
			_id: req.params.calendaruid
		}, function(err, user) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

router.route('/events')

        // create an event (accessed at POST http://localhost:8080/api/events)
        .post(function(req, res) {
            if (typeof req.body._id !== 'undefined' && typeof req.body._id !== null) {
		Eventt.findById(req.body._id, function(err, eventt) {
                        if (err)
                                res.send(err);
                        if(!eventt) {
		                var eventt = new Eventt();    
				eventt.name = req.body.name; 
				eventt._id = req.body._id;
				eventt.from = req.body.from;
				eventt.to = req.body.to;
				eventt.place = req.body.place;

				eventt.save(function(err) {
				        if (err)
				                res.send(err);

				        res.json({ message: 'Event created!' });
				});

			} else {
				res.send("This event id is existing");
			}
                });
	    } else {
		res.send("The event id is undefined");
	    }
        })

	.get(function(req, res) {
                Eventt.find(function(err, events) {
                        if (err)
                                res.send(err);

                        res.json(events);
                });
        });

router.route('/events/:eventname')

        .get(function(req, res) {
                Eventt.findById(req.params.eventname, function(err, eventt) {
                        if (err)
                                res.send(err);
                        res.json(eventt);
                });
        })

	.put(function(req, res) {

                Eventt.findById(req.params.eventname, function(err, eventt) {

                        if (err)
                                res.send(err);
			if (typeof req.body.name !== 'undefined') {
	                        eventt.name = req.body.name;
			}
			if (typeof req.body.from !== 'undefined') {
				eventt.from = req.body.from;
			}
			if (typeof req.body.to !== 'undefined') {
				eventt.to = req.body.to;
			}
			if (typeof req.body.place !== 'undefined') {
				eventt.place = req.body.place;
			}
                        
                        eventt.save(function(err) {
                                if (err)
                                        res.send(err);

                                res.json({ message: 'Event updated!' });
                        });

                });
        })
	.delete(function(req, res) {
		Eventt.remove({
			_id: req.params.eventname
		}, function(err, user) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

router.route('/places')

        .post(function(req, res) {
		Place.findById(req.body._id, function(err, user) {
		    if (err)
		    res.send(err);
	    	    if (!user) {
		        var place = new Place();  
		        place._id = req.body._id; 
			place.zip = req.body.zip;
			place.loc = { type: 'Point', coordinates: req.body.coordinates };

		        place.save(function(err) {
		                if (err)
		                        res.send(err);

		                res.json({ message: 'Place created!' });
		        });
		    } else {
			res.send("This username is existing");
		    }
	        });
        })

	.get(function(req, res) {
                Place.find(function(err, places) {
                        if (err)
                                res.send(err);

                        res.json(places);
                });
        });

router.route('/places/:place_id')

        .get(function(req, res) {
                Place.findById(req.params.place_id, function(err, place) {
                        if (err)
                                res.send(err);
			console.log(place);
                        res.json(place);
                });
        })
/*	//Abban állapodtunk meg, hogy a helyszínek nem változnak
.put(function(req, res) {

                Place.findById(req.params.place_id, function(err, place) {

                        if (err)
                                res.send(err);
                        if (typeof req.body.zip !== 'undefined') {
                                place.zip = req.body.zip;    
                        }
                        if (typeof req.body.coordinates !== 'undefined') {
				place.loc = { type: 'Point', coordinates: req.body.coordinates };
                        }

                        place.save(function(err) {
                                if (err)
                                        res.send(err);

                                res.json({ message: 'Place updated!' });
                        });

                });

        })*/;

router.route('/events/near/:loc')	//GET example: http://localhost:8080/api/events/near/47-19

        .get(function(req, res) {
		var location = new Array();
		var placename = new Array();
		var sugar;
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
                if (location.length<3) {
                         sugar=100000; //TODO: megnézni, h mennyi az optimális
                } else {
			sugar= parseInt(location[2]);
		}

/*		
		//Metódus definiálással így nézne ki ugyanez:
		Place.findByPlace = function (x,y, cb) {
		  this.find({ 
                                 loc: {
                                         $near : {
                                                 $geometry : {
                                                        type : "Point" , coordinates: [ x,y ] },$maxDistance : 100000//req.body.distance
                                                 }
                                         } }, cb);
		}

		var Hely = mongoose.model('Place', Place);
		Hely.findByPlace( parseInt(location[0]), parseInt(location[1]), function (err, places) {
		  res.json(places);
		});*/
                Place.find( {
                                 loc: {
                                         $near : {
                                                 $geometry : {
                                                        type : "Point" , coordinates: [ parseFloat(location[0]), parseFloat(location[1]) ] },$maxDistance : sugar
                                                 }
                                         }
                                 }
                        , function(err, place) {
                        if (err)
                                res.send(err);
			for (var c=0; c<place.length; c++) {
				placename.push(place[c]._id);
			}
			complete();	//Szépen a callbackben hívom meg, mert aszinkron baj
                });

		function complete() {
			if (placename !== null || typeof placename !== 'undefined') {
				Eventt.find({
					place: { $in: placename } 
					}, function(err, events) {
						if (err)
						        res.send(err);
						res.json(events);		
				});
			    
			}
		}

        });

//For warm up 
router.route('/warmup-rivers')
	.get(function(req, res) {
		River.find(function(err, obj) {
                        if (err)
                                res.send(err);

                        res.json({kész:"READY"});
                });
	  });

router.route('/warmup-cities')
	.get(function(req, res) {
		City.find(function(err, obj) {
                        if (err)
                                res.send(err);

                        res.json({kész:"READY"});
                });
	  });

router.route('/warmup-countries')
	.get(function(req, res) {
		Country.find(function(err, obj) {
                        if (err)
                                res.send(err);

                        res.json({kész:"READY"});
                });
	  });

router.route('/warmup-pontok')
	.get(function(req, res) {
		Pontok.find(function(err, obj) {
                        if (err)
                                res.send(err);

                        res.json({kész:"READY"});
                });
	  });

router.route('/warmup-waterways')
	.get(function(req, res) {
		WaterWay.find(function(err, obj) {
                        if (err)
                                res.send(err);

                        res.json({kész:"READY"});
                });
	  });


//Közelségi lekérdezések
router.route('/cities/near/:loc')	//GET example: http://localhost:8080/api/cities/near/19-47

        .get(function(req, res) {
		console.time('nearCities');
		var location = new Array();
		var sugar;
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
                if (location.length<3) {
                         sugar=100000;
                } else {
			sugar= parseInt(location[2]);
		}

                City.find( {
                                 geometry: {
                                         $near : {
                                                 $geometry : {
                                                        type : "Point" , coordinates: [ parseFloat(location[0]), parseFloat(location[1]) ] },$maxDistance : sugar
                                                 }
                                         }
                                 }
                        , function(err, cities) {
                        if (err)
                                res.send(err);
			res.json(cities);
			console.timeEnd('nearCities');
                });

		

        });

router.route('/cities/closest/:loc')
        .get(function(req, res) {
		console.time('closestCity');
		var location = new Array();
		if (typeof req.params.loc === "undefined") {
			location[0]=19;
			location[1]=47;
		} else {
			location = req.params.loc.split("-");
		}
                City.aggregate( { $geoNear: 
					{ near: [ parseFloat(location[0]), parseFloat(location[1]) ], 
					distanceField: "distance", spherical: true, limit: 1 
					} }
                        , function(err, city) {
                        if (err)
                                res.send(err);
			res.json(city);
			console.timeEnd('closestCity');
                });
        });

router.route('/pontok/closest/:loc')
        .get(function(req, res) {
		console.time('closestPont');
		var location = new Array();
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
                Pontok.aggregate( { $geoNear: 
					{ near: [ parseFloat(location[0]), parseFloat(location[1]) ], 
					distanceField: "distance", spherical: true, limit: 1 
					} }
                        , function(err, pont) {
                        if (err)
                                res.send(err);
			res.json(pont);
			console.timeEnd('closestPont');
                });
        });

router.route('/countries/closest/:loc')
        .get(function(req, res) {
		console.time('closestCountry');
		var location = new Array();
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
                Country.aggregate( { $geoNear: 
					{ near: [ parseFloat(location[0]), parseFloat(location[1]) ], 
					distanceField: "distance", spherical: true, distanceMultiplier: 6378000, limit: 1 
					} }
                        , function(err, pont) {
                        if (err)
                                res.send(err);
			res.json(pont);
			console.timeEnd('closestCountry');
                });
        });

router.route('/pontok/near/:loc')	//GET example: http://localhost:8080/api/events/near/47-19

        .get(function(req, res) {
		console.time('nearPontok');
		var location = new Array();
		var sugar;
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
                if (location.length<3) {
                         sugar=10000;
                } else {
			sugar= parseInt(location[2]);
		}

                Pontok.find( {
                                 geometry: {
                                         $near : {
                                                 $geometry : {
                                                        type : "Point" , coordinates: [ parseFloat(location[0]), parseFloat(location[1]) ] },$maxDistance : sugar
                                                 }
                                         }
                                 }
                        , function(err, cities) {
                        if (err)
                                res.send(err);
			res.json(cities);
			console.timeEnd('nearPontok');
                });
        });

router.route('/cntcitiesbbox/:xyxy')
	.get(function(req, res) {
		console.time('bBoxCnt');
		var bbox = new Array();
		var sugar;
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		City.count({     geometry: {
				         $geoWithin: {
					             $box: [ [ parseFloat(bbox[0]),parseFloat(bbox[1]) ],[ parseFloat(bbox[2]), parseFloat(bbox[3]) ] ]
						     }
				           }
		},function(err, places) {
		        if (err)
		                res.send(err);

		        res.json(places);
			console.timeEnd('bBoxCnt');
                });
	  });

router.route('/cntpontokbbox/:xyxy')
	.get(function(req, res) {
		console.time('bBoxCnt');
		var bbox = new Array();
		var sugar;
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		Pontok.count({     geometry: {
				         $geoWithin: {
					             $box: [ [ parseFloat(bbox[0]),parseFloat(bbox[1]) ],[ parseFloat(bbox[2]), parseFloat(bbox[3]) ] ]
						     }
				           }
		},function(err, places) {
		        if (err)
		                res.send(err);

		        res.json(places);
			console.timeEnd('bBoxCnt');
                });
	  });

router.route('/bboxcities/:xyxy')
	.get(function(req, res) {
		console.time('bBox');
		var bbox = new Array();
		var sugar;
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=18;
			bbox[1]=47;
			bbox[2]=18.5;
			bbox[3]=48;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		City.find({     geometry: {
				         $geoWithin: {
					             $box: [ [ parseFloat(bbox[0]),parseFloat(bbox[1]) ],[ parseFloat(bbox[2]), parseFloat(bbox[3]) ] ]
						     }
				           }
		},function(err, places) {
		        if (err)
		                res.send(err);

		        res.json(places);
			console.timeEnd('bBox');
                });
	  });

router.route('/pontok')
	.get(function(req, res) {
                Pontok.find(function(err, pontok) {
                        if (err)
                                res.send(err);

                        res.json(pontok);
                });
        });

router.route('/bboxpontok/:xyxy')
	.get(function(req, res) {
		console.time('bBoxpontok');
		var bbox = new Array();
		var sugar;
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		Pontok.find({     geometry: {
				         $geoWithin: {
					             $box: [ [ parseFloat(bbox[0]),parseFloat(bbox[1]) ],[ parseFloat(bbox[2]), parseFloat(bbox[3]) ] ]
						     }
				           }
		},function(err, places) {
		        if (err)
		                res.send(err);

		        res.json(places);
			console.timeEnd('bBoxpontok');
                });
	  });

router.route('/waterways')
	.get(function(req, res) {
                WaterWay.find(function(err, waterways) {
                        if (err)
                                res.send(err);

                        res.json(waterways);
                });
        });

router.route('/bboxwater/:xyxy')		//Semmit nem ad, mert a box csak pontra megy!
	.get(function(req, res) {
		console.time('bBoxwater');
		var bbox = new Array();
		var sugar;
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		WaterWay.find({     geometry: {
				         $geoWithin: {
					             $box: [ [ parseFloat(bbox[0]),parseFloat(bbox[1]) ],[ parseFloat(bbox[2]), parseFloat(bbox[3]) ] ]
						     }
				           }
		},function(err, places) {
		        if (err)
		                res.send(err);

		        res.json(places);
			console.timeEnd('bBoxwater');
                });
	  });


//Bounding box megvalósítása polygon-nal
router.route('/simbboxwatercnt/:xyxy')		//Semmit nem ad, mert a box csak pontra megy!
	.get(function(req, res) {
		console.time('bBoxwater');
		var bbox = new Array();
		var sugar;
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		WaterWay.count({     geometry: {
				         $geoWithin: {
					             $geometry: {
								type : "Polygon" , coordinates: 
								[ [ [ parseFloat(bbox[1]),parseFloat(bbox[0])], [parseFloat(bbox[1]),parseFloat(bbox[2])], [parseFloat(bbox[3]),parseFloat(bbox[2])], [parseFloat(bbox[3]),parseFloat(bbox[0])], [ parseFloat(bbox[1]),parseFloat(bbox[0])] ] ]
								}
						     }
				           }
		},function(err, places) {
		        if (err)
		                res.send(err);

		        res.json(places);
			console.timeEnd('bBoxwater');
                });
	  });

router.route('/simbboxpontokcnt/:xyxy')		//Semmit nem ad, mert a box csak pontra megy!
	.get(function(req, res) {
		console.time('bBoxwater');
		var bbox = new Array();
		var sugar;
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		Pontok.count({     geometry: {
				         $geoWithin: {
					             $geometry: {
								type : "Polygon" , coordinates: 
								[ [ [ parseFloat(bbox[1]),parseFloat(bbox[0])], [parseFloat(bbox[1]),parseFloat(bbox[2])], [parseFloat(bbox[3]),parseFloat(bbox[2])], [parseFloat(bbox[3]),parseFloat(bbox[0])], [ parseFloat(bbox[1]),parseFloat(bbox[0])] ] ]
								}
						     }
				           }
		},function(err, places) {
		        if (err)
		                res.send(err);

		        res.json(places);
			console.timeEnd('bBoxwater');
                });
	  });

router.route('/simbboxcitiescnt/:xyxy')		//Semmit nem ad, mert a box csak pontra megy!
	.get(function(req, res) {
		console.time('bBoxwater');
		var bbox = new Array();
		var sugar;
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		City.count({     geometry: {
				         $geoWithin: {
					             $geometry: {
								type : "Polygon" , coordinates: 
								[ [ [ parseFloat(bbox[1]),parseFloat(bbox[0])], [parseFloat(bbox[1]),parseFloat(bbox[2])], [parseFloat(bbox[3]),parseFloat(bbox[2])], [parseFloat(bbox[3]),parseFloat(bbox[0])], [ parseFloat(bbox[1]),parseFloat(bbox[0])] ] ]
								}
						     }
				           }
		},function(err, places) {
		        if (err)
		                res.send(err);

		        res.json(places);
			console.timeEnd('bBoxwater');
                });
	  });

router.route('/simbboxpontok/:xyxy')
	.get(function(req, res) {
		console.time('bBoxpontok');
		var bbox = new Array();
		var sugar;
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		Pontok.find({     geometry: {
				         $geoWithin: {
					             $geometry: {
								type : "Polygon" , coordinates: 
								[ [ [ parseFloat(bbox[1]),parseFloat(bbox[0])], [parseFloat(bbox[1]),parseFloat(bbox[2])], [parseFloat(bbox[3]),parseFloat(bbox[2])], [parseFloat(bbox[3]),parseFloat(bbox[0])], [ parseFloat(bbox[1]),parseFloat(bbox[0])] ] ]
								}
						     }
				           }
		},function(err, places) {
		        if (err)
		                res.send(err);

		        res.json(places);
			console.timeEnd('bBoxpontok');
                });
	  });

router.route('/simbboxcities/:xyxy')
	.get(function(req, res) {
		console.time('bBoxpontok');
		var bbox = new Array();
		var sugar;
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		City.find({     geometry: {
				         $geoWithin: {
					             $geometry: {
								type : "Polygon" , coordinates: 
								[ [ [ parseFloat(bbox[1]),parseFloat(bbox[0])], [parseFloat(bbox[1]),parseFloat(bbox[2])], [parseFloat(bbox[3]),parseFloat(bbox[2])], [parseFloat(bbox[3]),parseFloat(bbox[0])], [ parseFloat(bbox[1]),parseFloat(bbox[0])] ] ]
								}
						     }
				           }
		},function(err, places) {
		        if (err)
		                res.send(err);

		        res.json(places);
			console.timeEnd('bBoxpontok');
                });
	  });

router.route('/cities')

     /*   .post(function(req, res) {
		Place.findById(req.body._id, function(err, user) {
		    if (err)
		    res.send(err);
	    	    if (!user) {
		        var place = new Place();  
		        place._id = req.body._id; 
			place.zip = req.body.zip;
			place.loc = { type: 'Point', coordinates: req.body.coordinates };

		        place.save(function(err) {
		                if (err)
		                        res.send(err);

		                res.json({ message: 'Place created!' });
		        });
		    } else {
			res.send("This username is existing");
		    }
	        });
        });*/
	.get(function(req, res) {
                City.find(function(err, places) {
                        if (err)
                                res.send(err);

                        res.json(places);
			console.log(places);
                });
        });

router.route('/rivers')
	.get(function(req, res) {
                River.find(function(err, rivers) {
                        if (err)
                                res.send(err);

                        res.json(rivers);
                });
        });

router.route('/countries')
	.get(function(req, res) {
                Country.find(function(err, country) {
                        if (err)
                                res.send(err);

                        res.json(country);
                });
        });

router.route('/within/rivers/:country') //rivers within a country

        .get(function(req, res) {
		console.time('Within');
		var cntryGeom;
		var tipus;

		Country.find({ 'properties.ISO_3DIGIT' : req.params.country 
			}, 'geometry', function(err, cntry) {
				if (err) {
				        res.send(err);
					console.log(err);
				}				
				tipus = cntry[0].geometry.type;
				if (tipus == 'Polygon') {
					cntryGeom = cntry[0].geometry.coordinates;
					complete();
				} else {
					res.send('Multipoligon esetén a művelet nem értelmezhető :(');
				}		
		});

                function complete() {
			if (cntryGeom !== null || typeof cntryGeom !== 'undefined') {
				River.find( {
		                         geometry: {
		                                 $geoWithin : {
		                                         $geometry : 
								{ type : tipus ,//itt polygon lesz
				                                 coordinates : cntryGeom
								}
		                                         }
		                                 }
		                         } , function(err, river) {
						if (err) {
						        res.send(err);
							console.log(err);
						}
						res.json(river);
						console.timeEnd('Within');
				});
		        }
		}
        });

router.route('/quickWithin/rivers/:iso3') //rivers within a country

        .get(function(req, res) {
		console.time('QuickWithin');
		var cntryGeom;
		var tipus;

		mongoose.connection.db.eval("within('"+req.params.iso3+"')", function(err, rivers) {
		   if (err)
                        res.send(err);   
		   res.json(rivers);
		   console.timeEnd('QuickWithin');
		});
        });

router.route('/quickIntersect/_rivers/:rivname') //rivers intersects another river

        .get(function(req, res) {
		console.time('QuickIntersect');
		var cntryGeom;
		var tipus;

		mongoose.connection.db.eval("intersect('"+req.params.rivname+"')", function(err, rivers) {
		   if (err)
                        res.send(err);   
		   res.json(rivers);
		   console.timeEnd('QuickIntersect');
		});
        });

router.route('/quickIntersect/rivers/:rivname') //river intersects  countries

        .get(function(req, res) {
		console.time('QuickIntersectCNTRY');
		var cntryGeom;
		var tipus;

		mongoose.connection.db.eval("intersectCountry('"+req.params.rivname+"')", function(err, rivers) {
		   if (err)
                        res.send(err);   
		   res.json(rivers);
		   console.timeEnd('QuickIntersectCNTRY');
		});
        });

router.route('/intersects/rivers/:country') //river intersects  countries

        .get(function(req, res) {
		console.time('RiverInterCountry');
		var cntryGeom;
		var tipus;

		Country.find({ 'properties.ISO_3DIGIT' : req.params.country 
			}, 'geometry', function(err, cntry) {
				if (err) {
				        res.send(err);
					console.log(err);
				}				
				tipus = cntry[0].geometry.type;
				cntryGeom = cntry[0].geometry.coordinates;
				complete();
	
		});

                function complete() {
			if (cntryGeom !== null || typeof cntryGeom !== 'undefined') {
				River.find( {
		                         geometry: {
		                                 $geoIntersects : {
		                                         $geometry : 
								{ type : tipus ,	
				                                 coordinates : cntryGeom
								}
		                                         }
		                                 }
		                         } , function(err, river) {
						if (err) {
						        res.send(err);
							console.log(err);
						}
						res.json(river);
						console.timeEnd('RiverInterCountry');
				});
		        }
		}
        });

router.route('/intersects_/rivers/:river') //rivers intersects a river	TODO: handle non-existent names (többi intersect esetén is)

        .get(function(req, res) {
		console.time('interRiverRiver');	//Ezzel mérhető a futási idő
		var rivGeom;
		var tipus;
		var nev;

		River.find({ 'properties.NAME' : req.params.river
			}, 'geometry', function(err, riv) {
				if (err) {
				        res.send(err);
					console.log(err);
				}	
				tipus = riv[0].geometry.type;			
				rivGeom = riv[0].geometry.coordinates;
				nev = riv[0]._id;
				complete();
	
		});

                function complete() {
			if (rivGeom !== null || typeof rivGeom !== 'undefined') {

				var query = River.find( {
		                         geometry: {
		                                 $geoIntersects : {
		                                         $geometry : 
								{ type : tipus ,	
				                                 coordinates : rivGeom
								}
		                                         }
		                                 }
		                         }).where('_id').ne(nev); //Don't get itself
				query.exec(function (err, river) {
				        if (err) {
						res.send(err);
						console.log(err);
					}
					res.json(river);
					console.timeEnd('interRiverRiver');
				});
		        }
		}
        });

router.route('/intersects/cities/:river') //cities intersects a river : nem ad vissza semmit

        .get(function(req, res) {
		var rivGeom;
		
		River.find({ 'properties.NAME' : req.params.river
			}, 'geometry', function(err, riv) {
				if (err) {
				        res.send(err);
					console.log(err);
				}				
				rivGeom = riv[0].geometry.coordinates;
				complete();
	
		});

                function complete() {
			if (rivGeom !== null || typeof rivGeom !== 'undefined') {
				City.find( {
		                         geometry: {
		                                 $geoIntersects : {
		                                         $geometry : 
								{ type : 'LineString' ,	
				                                 coordinates : rivGeom 
								}
		                                         }
		                                 }
		                         } , function(err, city) {
						if (err) {
						        res.send(err);
							console.log(err);
						}
						res.json(city);
				});
		        }
		}
        });


router.route('/intersects/countries/:river') //countries intersects a river

        .get(function(req, res) {
		console.time('CountryInterRiver');
		var rivGeom;
		
		River.find({ 'properties.NAME' : req.params.river
			}, 'geometry', function(err, riv) {
				if (err) {
				        res.send(err);
					console.log(err);
				}	
				rivGeom = riv[0].geometry.coordinates;
				complete();
	
		});

                function complete() {
			if (rivGeom !== null || typeof rivGeom !== 'undefined') {
				Country.find( {
		                         geometry: {
		                                 $geoIntersects : {
		                                         $geometry : 
								{ type : 'LineString' ,	
				                                 coordinates : rivGeom 
								}
		                                         }
		                                 }
		                         } , function(err, country) {
						if (err) {
						        res.send(err);
							console.log(err);
						}
						res.json(country);
						console.timeEnd('CountryInterRiver');
				});
		        }
		}
        });

///
//Linear reference system
///
//We can get here the sizes
router.route('/lrs/:river')
	.get(function(req, res) {

		var rivGeom;

		River.find({ 'properties.NAME' : req.params.river
			}, 'geometry', function(err, riv) {
				if (err) {
				        res.send(err);
					console.log(err);
				}			
				rivGeom = riv[0].geometry.coordinates;
		res.render('lrs', {river:req.params.river, coordinates:rivGeom});
		});

        });

//Dolgozzuk fel a kapott LRS-t
app2.post('/submitLRS', function(req,res){
	console.time('LRS');
	//console.time('LRSMongoSide');
	var meretArr = [];
	var sizeArr=JSON.stringify(req.body).split(',');
	for (var i = 0, len = sizeArr.length; i < len-1; i++) {//A folyó neve az utolsó koordináta
		var n = sizeArr[i].search("\":\"")+3;	//A többi elemet "megpucoljuk"
		var size = sizeArr[i].substr(n, sizeArr[i].length-2);
		size = size.replace('{','');
		size = size.replace('}','');
		size = size.replace('"','');
		meretArr.push(size);
	}
	//Ellenőrizzük, hogy ki vannak-e töltve az adatok
	if (meretArr[0]==="" || typeof meretArr[0] === "undefined" || meretArr[meretArr.length-1]==="" || typeof meretArr[meretArr.length-1] === "undefined") {
		res.send("Az első és az utolsó méret megadása kötelező!");
		return;
	}
	var monNovo;
	meretArr[0]=parseFloat(meretArr[0]);//Az első elem legyen float
	var former=meretArr[0]; //Ez úgyis meg van adva, ha ide eljutunk
	for (var c=1; c<meretArr.length; c++) {
		if (meretArr[c]!="" && typeof meretArr[c] != "undefined") {
			meretArr[c]=parseFloat(meretArr[c]);
			if (typeof monNovo === "undefined") { //ha még nem tudjuk, hogy növő, vagy csökkenő lesz
				if (former<meretArr[c]) {
					monNovo=true;
				} else {
					monNovo=false;
				}
			}
			if (former<meretArr[c] && !monNovo) {
				res.send("Az elemek vagy monoton növekedjenek, vagy csökkenjenek!");
				return;
			} else if (former>meretArr[c] && monNovo) {
				res.send("Az elemek vagy monoton növekedjenek, vagy csökkenjenek!");
				return;
			}
			former=meretArr[c];
		}
	}
	var riverName=(sizeArr[sizeArr.length-1]);	//A folyó neve az utolsó koordináta
	riverName = riverName.replace(':','');
	riverName = riverName.replace('}','');
	riverName = riverName.replace('"','');
	riverName = riverName.replace('"','');
	riverName = riverName.replace('"','');
	riverName = riverName.replace('"','');
	//distServerSide(riverName, meretArr, res);//Szerveren számol távot	-> NEM PONTOS, de javítottam rajt
	//distMongoSide(riverName, meretArr, res);//DB-ben számol távot, kevesebb szerver-DB kommunikáció, de írja a DB-t->lassú:
	distQuickMongoSide(riverName, meretArr, res);
	//distHaversine(riverName, meretArr, res);	//Szerveren számol távot, saját haversine
})

function distQuickMongoSide(riverName, meretArr, res) {
	console.time('LRSMongoSide');
	mongoose.connection.db.eval("LRSWithoutWrite('"+riverName+"','"+meretArr+"')", function(err, ret) {//Mongo A tömböt (meretArr) string-ként kapja
	   if (err)
                res.send(err);  
	   res.render('lrsReturn', {river:riverName, coordinates:ret[1], meretek:ret[0]});
	   console.timeEnd('LRSMongoSide');
	});
}

function distMongoSide(riverName, meretArr, res) {
	console.time('LRSMongoSide');
	mongoose.connection.db.eval("LRS('"+riverName+"','"+meretArr+"')", function(err, ret) {//Mongo A tömböt (meretArr) string-ként kapja
	   if (err)
                res.send(err);  
	   res.render('lrsReturn', {river:riverName, coordinates:ret[1], meretek:ret[0]});
	   console.timeEnd('LRSMongoSide');
	});
}

function interpolation(hosszok,riverName, meretArr,rivGeom, res) {
	var startPont=0;//a 2 pont első pontja, amik közt interpolálunk
	var i=0;
	while (i<hosszok.length) {
		var hossz=0;//2 pont közti teljes távot szummázzuk benne
		do {//Amíg meg nem találjuk a 2 pont 2. pontját
			hossz+=hosszok[i];
			i++;
		}while (meretArr[i]==="" || typeof meretArr[i] === "undefined");
		var unit = (meretArr[i]-meretArr[startPont])/hossz;	//mennyi 1 méret egység?
		for (var j=startPont+1; j<i; j++) {
			meretArr[j]=meretArr[j-1]+unit*hosszok[j-1];	//Köztes elem értéke
		}
		startPont=i;//Új startpont
	}
	//res.json(meretArr);
	function renderelo() {
		res.render('lrsReturn', {river:riverName, coordinates:rivGeom, meretek:meretArr});
	}
	renderelo();
	console.timeEnd('LRS');
}

function distHaversine(riverName, meretArr, res) {
	getRiver (riverName, function(cbRivGeom) {
		cbRivGeom[0] = JSON.stringify(cbRivGeom[0]).replace('[','');
		cbRivGeom[0] = cbRivGeom[0].replace(']','');
		var hosszok = new Array();	//Ebben vannak a 2 pont közti távok
		for (var c=0; c<meretArr.length-1;c++) {		//Nem kell végigmenni ugye
			var P1 = cbRivGeom[c].split(',');
			cbRivGeom[c+1] = JSON.stringify(cbRivGeom[c+1]).replace('[','');
			cbRivGeom[c+1] = cbRivGeom[c+1].replace(']','');
			var P2 = cbRivGeom[c+1].split(',');
			var distance = haversine(parseFloat(P1[1]), parseFloat(P2[1]), parseFloat(P1[0]), parseFloat(P2[0]));//Távok méterben
			hosszok.push(distance);
		}
		interpolation(hosszok,riverName, meretArr,cbRivGeom, res);
	})
}

function distServerSide(riverName, meretArr, res) {
	getRiver (riverName, function(cbRivGeom) {
		cbRivGeom[0] = JSON.stringify(cbRivGeom[0]).replace('[','');
		cbRivGeom[0] = cbRivGeom[0].replace(']','');
		var hosszok = new Array();	//Ebben vannak a 2 pont közti távok
		for (var c=0; c<meretArr.length-1;c++) {		//Nem kell végigmenni ugye
			var P1 = cbRivGeom[c].split(',');
			cbRivGeom[c+1] = JSON.stringify(cbRivGeom[c+1]).replace('[','');
			cbRivGeom[c+1] = cbRivGeom[c+1].replace(']','');
			var P2 = cbRivGeom[c+1].split(',');
			var distance = geolib.getDistance(
			    {latitude: P1[1], longitude: P1[0]}, 
			    {latitude: P2[1], longitude: P2[0]}
			);
			hosszok.push(distance);
		}
		interpolation(hosszok,riverName, meretArr,cbRivGeom, res);
	})
}

function getRiver(riverName, cb) {	/*Server-es számolásban használjuk*/
	River.find({ 'properties.NAME' : riverName
		}, 'geometry', function(err, riv) {
			if (err) {
			        res.send(err);
				console.log(err);
			}			
			rivGeom = riv[0].geometry.coordinates;
			cb(rivGeom);			
	});
}

function haversine(lat1, lat2, lon1, lon2) {
	var R = 6371000; // metres
	var φ1 = lat1.toRad();
	var φ2 = lat2.toRad();
	var Δφ = (lat2-lat1).toRad();
	var Δλ = (lon2-lon1).toRad();

	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
		Math.cos(φ1) * Math.cos(φ2) *
		Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return R * c;
}

//Felparaméterezés példa: http://localhost:8080/api/line_locate_pt/47.5-19.2343-Danube
router.route('/line_locate_pt/:loc')
	.get(function(req, res) {
		console.time("locate_pt");
		var rivGeom;
		var location = new Array();
		var river;
		var p;
		if (typeof req.params.loc === "undefined") {
			p={lat:47, lng:19.5};
			river= "Tisa";
		} else {
			location = req.params.loc.split("-");
			p={lat:location[0], lng:location[1]}
		}
                if (location.length<3) {
                         river= "Tisa";
                } else {
			river= location[2];
		}
		River.find({ 'properties.NAME' : river
			}, 'geometry', function(err, riv) {
				if (err) {
				        res.send(err);
					console.log(err);
				}	
				if (typeof riv[0] == 'undefined') {
					res.json("Ilyen nevu folyo nincs az adatbazisban");
				} else {		
					rivGeom = riv[0].geometry.coordinates;
					var closestPoint=bdccGeoDistanceToPolyMtrs(rivGeom,p);

					rivGeom[0] = JSON.stringify(rivGeom[0]).replace('[','');
					rivGeom[0] = rivGeom[0].replace(']','');
					var hosszok = 0;	//Ebben most szummázzuk a pontok közti távokat
					var pontTavja=0;
					var elertuk=false;
					for (var c=0; c<rivGeom.length-1;c++) {	//Nem kell végigmenni ugye
						var P1 = rivGeom[c].split(',');
						rivGeom[c+1] = JSON.stringify(rivGeom[c+1]).replace('[','');
						rivGeom[c+1] = rivGeom[c+1].replace(']','');
						var P2 = rivGeom[c+1].split(',');
						var distance = geolib.getDistance(
						    {latitude: P1[1], longitude: P1[0]}, 
						    {latitude: P2[1], longitude: P2[0]}
						);
						hosszok+=distance;
						if (P1[1]==closestPoint.formerLat && P1[0]==closestPoint.formerLng) { //Lehet P2vel kéne nézni
							elertuk=true;
						}
						if (!elertuk) {
							pontTavja+=distance;
						}
					}
					pontTavja+=geolib.getDistance(
						    {latitude: closestPoint.formerLat.toString(), longitude: closestPoint.formerLng.toString()}, 
						    {latitude: closestPoint.lat.toString(), longitude: closestPoint.lng.toString()}
						);
					res.json(pontTavja/hosszok);
					console.timeEnd("locate_pt");
				}
		});

        });

//Felparaméterezés példa: http://localhost:8080/api/line_interpolate_pt/0.342-Sava
router.route('/line_interpolate_pt/:river')
	.get(function(req, res) {
		console.time("interpoalte_pt");
		var rivGeom, river, ratio;
		if (typeof req.params.river === "undefined") {
			ratio=0.5;
			river= "Tisa";
		} else {
			var location = req.params.river.split("-");
			ratio=location[0];
			river=location[1];
		}
		River.find({ 'properties.NAME' : river
			}, 'geometry', function(err, riv) {
				if (err) {
				        res.send(err);
					console.log(err);
				}		
			rivGeom = riv[0].geometry.coordinates;
			if (typeof riv[0] == 'undefined') {
				res.json("Ilyen nevu folyo nincs az adatbazisban");
			} else {
				rivGeom = riv[0].geometry.coordinates;
				rivGeom[0] = JSON.stringify(rivGeom[0]).replace('[','');
				rivGeom[0] = rivGeom[0].replace(']','');
				var hosszok=0;//Útvonal teljes hossza
				for (var c=0; c<rivGeom.length-1;c++) {	//Nem kell végigmenni ugye
					var P1 = rivGeom[c].split(',');
					rivGeom[c+1] = JSON.stringify(rivGeom[c+1]).replace('[','');
					rivGeom[c+1] = rivGeom[c+1].replace(']','');
					var P2 = rivGeom[c+1].split(',');
					var distance = geolib.getDistance(
					    {latitude: P1[1], longitude: P1[0]}, 
					    {latitude: P2[1], longitude: P2[0]}
					);
					hosszok+=distance;
				}
				var aktTav=0;
				var egyelKorabbitav=0;
				var c=0;
				do {
					var P1 = rivGeom[c].split(',');
					var P2 = rivGeom[c+1].split(',');
					var distance = geolib.getDistance(
					    {latitude: P1[1], longitude: P1[0]}, 
					    {latitude: P2[1], longitude: P2[0]}
					);
					aktTav+=distance;
					egyelKorabbitav = aktTav - distance;
					c++;
				} while (aktTav/hosszok<ratio);
				//pont a c-1. és c. közt lesz.
				var P1 = rivGeom[c-1].split(',');
				var P2 = rivGeom[c].split(',');
				var pt1 = new bdccGeo(P1[1],P1[0]);
				var pt2 = new bdccGeo(P2[1],P2[0]);
				var pt3 = new bdccGeo();
				//Ez lesz az arány, hogy az adott volan 2 pontja közt milyen arányban van a pont
				//TODO: Itt rosszul számol még (line_substring esetén ugyanez) MYRATIO rossz
				var myRatio=( ratio-(egyelKorabbitav/hosszok) ) / ( (aktTav/hosszok)-(egyelKorabbitav/hosszok) );
				pt3.x=pt1.x+myRatio*(pt2.x-pt1.x);
				pt3.y=pt1.y+myRatio*(pt2.y-pt1.y);
				pt3.z=pt1.z+myRatio*(pt2.z-pt1.z);
				res.json("lat: "+pt3.getLatitude()+", lon: "+pt3.getLongitude());
				console.timeEnd("interpoalte_pt");
			}
		});
        });


//Felparaméterezés példa: http://localhost:8080/api/line_substring/0.342-0.66-Sava
router.route('/line_substring/:river')
	.get(function(req, res) {
		console.time("line_substr");
		var rivGeom, river, startFraction, endFraction;
		if (typeof req.params.river === "undefined") {
			startFraction=0.5;
			endFraction=0.7;
			river= "Tisa";
		} else {
			var location = req.params.river.split("-");
			startFraction=location[0];
			endFraction=location[1];
			river=location[2];
		}
		River.find({ 'properties.NAME' : river
			}, 'geometry', function(err, riv) {
				if (err) {
				        res.send(err);
					console.log(err);
				}			
			rivGeom = riv[0].geometry.coordinates;
			if (typeof riv[0] == 'undefined') {
				res.json("Ilyen nevu folyo nincs az adatbazisban");
			} else {
				var lineSubStr = new Array();
				rivGeom = riv[0].geometry.coordinates;
				rivGeom[0] = JSON.stringify(rivGeom[0]).replace('[','');
				rivGeom[0] = rivGeom[0].replace(']','');
				var hosszok=0;//Útvonal teljes hossza
				for (var c=0; c<rivGeom.length-1;c++) {	//Nem kell végigmenni ugye
					var P1 = rivGeom[c].split(',');
					rivGeom[c+1] = JSON.stringify(rivGeom[c+1]).replace('[','');
					rivGeom[c+1] = rivGeom[c+1].replace(']','');
					var P2 = rivGeom[c+1].split(',');
					var distance = geolib.getDistance(
					    {latitude: P1[1], longitude: P1[0]}, 
					    {latitude: P2[1], longitude: P2[0]}
					);
					hosszok+=distance;
				}
				var aktTav=0;
				var egyelKorabbitav=0;
				var c=0;
				do {
					var P1 = rivGeom[c].split(',');
					var P2 = rivGeom[c+1].split(',');
					var distance = geolib.getDistance(
					    {latitude: P1[1], longitude: P1[0]}, 
					    {latitude: P2[1], longitude: P2[0]}
					);
					aktTav+=distance;
					egyelKorabbitav = aktTav - distance;
					c++;
				} while (aktTav/hosszok<startFraction);
				//pont a c-1. és c. közt lesz.
				var P1 = rivGeom[c-1].split(',');
				var P2 = rivGeom[c].split(',');
				var pt1 = new bdccGeo(P1[1],P1[0]);
				var pt2 = new bdccGeo(P2[1],P2[0]);
				var pt3 = new bdccGeo();
				//Ez lesz az arány, hogy az adott volan 2 pontja közt milyen arányban van a pont
				var myRatio=( startFraction-(egyelKorabbitav/hosszok) ) / ( (aktTav/hosszok)-(egyelKorabbitav/hosszok) );
				pt3.x=pt1.x+myRatio*(pt2.x-pt1.x);
				pt3.y=pt1.y+myRatio*(pt2.y-pt1.y);
				pt3.z=pt1.z+myRatio*(pt2.z-pt1.z);
				//res.json("lat: "+pt3.getLatitude()+", lon: "+pt3.getLongitude());
				lineSubStr.push("lat: "+pt3.getLatitude()+", lon: "+pt3.getLongitude());
				while (aktTav/hosszok<endFraction) {
					var P1 = rivGeom[c].split(',');
					var P2 = rivGeom[c+1].split(',');
					lineSubStr.push("lat: "+P1[1]+", lon: "+P1[0]);
					var distance = geolib.getDistance(
					    {latitude: P1[1], longitude: P1[0]}, 
					    {latitude: P2[1], longitude: P2[0]}
					);
					aktTav+=distance;
					egyelKorabbitav = aktTav - distance;
					c++;
				}
				var P1 = rivGeom[c-1].split(',');
				var P2 = rivGeom[c].split(',');
				var pt1 = new bdccGeo(P1[1],P1[0]);
				var pt2 = new bdccGeo(P2[1],P2[0]);
				var pt3 = new bdccGeo();
				//Ez lesz az arány, hogy az adott volan 2 pontja közt milyen arányban van a pont
				myRatio=( endFraction-(egyelKorabbitav/hosszok) ) / ( (aktTav/hosszok)-(egyelKorabbitav/hosszok) );
				pt3.x=pt1.x+myRatio*(pt2.x-pt1.x);
				pt3.y=pt1.y+myRatio*(pt2.y-pt1.y);
				pt3.z=pt1.z+myRatio*(pt2.z-pt1.z);
				lineSubStr.push("lat: "+pt3.getLatitude()+", lon: "+pt3.getLongitude());
				res.json(lineSubStr);
				console.timeEnd("line_substr");
			}
		});
        });

// Code to find the distance in metres between a lat/lng point and a polyline of lat/lng points
        // Construct a bdccGeo from its latitude and longitude in degrees
        function bdccGeo(lat, lon) 
        {
            var theta = (lon * Math.PI / 180.0);
            var rlat = bdccGeoGeocentricLatitude(lat * Math.PI / 180.0);
            var c = Math.cos(rlat); 
            this.x = c * Math.cos(theta);
            this.y = c * Math.sin(theta);
            this.z = Math.sin(rlat);        
        }
        bdccGeo.prototype = new bdccGeo();

        // internal helper functions =========================================

        // Convert from geographic to geocentric latitude (radians).
        function bdccGeoGeocentricLatitude(geographicLatitude) 
        {
            return Math.atan((Math.tan(geographicLatitude) ));
        }

	// Convert from geocentric to geographic latitude (radians)
	function bdccGeoGeographicLatitude (geocentricLatitude) 
	{
		var flattening = 1.0 / 298.257223563;//WGS84
	    var f = (1.0 - flattening) * (1.0 - flattening);
		return Math.atan(Math.tan(geocentricLatitude) / f);
	}

         // Returns the two antipodal points of intersection of two great
         // circles defined by the arcs geo1 to geo2 and
         // geo3 to geo4. Returns a point as a Geo, use .antipode to get the other point
        function bdccGeoGetIntersection( geo1,  geo2,  geo3,  geo4) 
        {
            var geoCross1 = geo1.crossNormalize(geo2);
            var geoCross2 = geo3.crossNormalize(geo4);
            return geoCross1.crossNormalize(geoCross2);
        }

        //from Radians to Meters
        function bdccGeoRadiansToMeters(rad)
        {
            return rad * 6378137.0; // WGS84 Equatorial Radius in Meters
        }

	//Két pont által meghatározott egyenesen hol van a legközelebbi pont P-hez?
	function GetClosestPoint(A, B, P) {
		  var a_to_p = [P.x - A.x, P.y - A.y, P.z - A.z]     // Storing vector A->P
		  var a_to_b = [B.x - A.x, B.y - A.y, B.z - A.z]     // Storing vector A->B

		  var atb2 = Math.pow(a_to_b[0],2) + Math.pow(a_to_b[1],2) + Math.pow(a_to_b[2],2)  // **2 means "squared"
				                      //   Basically finding the squared magnitude
				                      //   of a_to_b

		  var atp_dot_atb = a_to_p[0]*a_to_b[0] + a_to_p[1]*a_to_b[1] + a_to_p[2]*a_to_b[2]
				                      // The dot product of a_to_p and a_to_b

		  var t = atp_dot_atb / atb2              // The normalized "distance" from a to
				                      //   your closest point

		    var r = new bdccGeo(0,0);
		    r.x = A.x + a_to_b[0]*t;
		    r.y = A.y + a_to_b[1]*t;
		    r.z = A.z + a_to_b[2]*t;
		    return r;
				                      // Add the distance to A, moving
				                      //   towards B
	}

        // properties =================================================


        bdccGeo.prototype.getLatitudeRadians = function() 
        {
	    return (Math.asin(this.z));

		//return bdccGeoGeographicLatitude( Math.atan2(this.z,Math.sqrt( (this.x * this.x) + (this.y * this.y) ) ) );
        }

        bdccGeo.prototype.getLongitudeRadians = function() 
        {
            return (Math.atan2(this.y, this.x));
        }

        bdccGeo.prototype.getLatitude = function() 
        {
            return this.getLatitudeRadians()  * 180.0 / Math.PI;
        }

        bdccGeo.prototype.getLongitude = function() 
        {
            return this.getLongitudeRadians()  * 180.0 / Math.PI ;
        }

        // Methods =================================================

        bdccGeo.prototype.dot = function( b) 
        {
            return ((this.x * b.x) + (this.y * b.y) + (this.z * b.z));
        }

        bdccGeo.prototype.crossLength = function( b) 
        {
            var x = (this.y * b.z) - (this.z * b.y);
            var y = (this.z * b.x) - (this.x * b.z);
            var z = (this.x * b.y) - (this.y * b.x);
            return Math.sqrt((x * x) + (y * y) + (z * z));
        }

        bdccGeo.prototype.scale = function( s) 
        {
            var r = new bdccGeo(0,0);
            r.x = this.x * s;
            r.y = this.y * s;
            r.z = this.z * s;
            return r;
        }

        // More Maths
        bdccGeo.prototype.crossNormalize = function( b) 
        {
            var x = (this.y * b.z) - (this.z * b.y);
            var y = (this.z * b.x) - (this.x * b.z);
            var z = (this.x * b.y) - (this.y * b.x);
            var L = Math.sqrt((x * x) + (y * y) + (z * z));
            var r = new bdccGeo(0,0);
            r.x = x / L;
            r.y = y / L;
            r.z = z / L;
            return r;
        }

      // point on opposite side of the world to this point
        bdccGeo.prototype.antipode = function() 
        {
            return this.scale(-1.0);
        }

        //distance in radians from this point to point v2
        bdccGeo.prototype.distance = function( v2) 
        {
            return Math.atan2(v2.crossLength(this), v2.dot(this));
        }

      //returns in meters the minimum of the perpendicular distance of this point from the line segment geo1-geo2
      //and the distance from this point to the line segment ends in geo1 and geo2 
	//plusz a legközelebbi pont lat és lng koordinátáit is visszaadja
        bdccGeo.prototype.distanceToLineSegMtrs = function(geo1, geo2)
        {    
            //point on unit sphere above origin and normal to plane of geo1,geo2
            //could be either side of the plane
            //var p2 = geo1.crossNormalize(geo2); 

            // geo1/geo2 által meghatározott egyenesre állítunk 1 merőlegest, úgy, hogy p-n átmenjen
            //var ip = bdccGeoGetIntersection(geo1,geo2,this,p2); 

	    var closestpoint = GetClosestPoint(geo1, geo2, this);
		
		//Szakaszon rajt van-e a pont?


            //vizsgáljuk, hogy a merőleges a szakaszra esik-e
	    var d = geo1.distance(geo2);
            var d1p = geo1.distance(closestpoint);
            var d2p = geo2.distance(closestpoint);

		if (d-0.00000000001<d1p+d2p && d1p+d2p <d+0.00000000001) {	//Kis tolerancia

			
			//Ráesik (itt lehet valami tolerancia számot kell definiálni)
 			return {"dist":bdccGeoRadiansToMeters(this.distance(closestpoint)), "lat":closestpoint.getLatitude(), "lng":closestpoint.getLongitude()};
		} else {
			//Nem esik rá
			if (d1p > d2p) {
				//1. ponthoz vagyunk közelebb
				return {"dist":bdccGeoRadiansToMeters(this.distance(geo1)), "lat":geo1.getLatitude(), "lng":geo1.getLongitude()};
			} else {
				//2. ponthoz vagyunk közelebb
				return {"dist":bdccGeoRadiansToMeters(this.distance(geo2)), "lat":geo2.getLatitude(), "lng":geo2.getLongitude()};
			}
		}

		//Korábbi módszer
            /*var d = geo1.distance(geo2);
            var d1p = geo1.distance(ip);
            var d2p = geo2.distance(ip);
            if ((d >= d1p) && (d >= d2p)) {
	    
	    //console.log("lat"+ip.getLatitude()+ "lng"+ip.getLongitude());
                return {"dist":bdccGeoRadiansToMeters(this.distance(ip)), "lat":ip.getLatitude(), "lng":ip.getLongitude()};
	    }
            else
            {
                ip = ip.antipode(); 
                d1p = geo1.distance(ip);
                d2p = geo2.distance(ip);
            }
            if ((d >= d1p) && (d >= d2p)) {
                return {"dist":bdccGeoRadiansToMeters(this.distance(ip)), "lat":ip.getLatitude(), "lng":ip.getLongitude()};
	    }
            else {
		if (geo1.distance(this)<geo2.distance(this)) {
			return {"dist":bdccGeoRadiansToMeters(this.distance(geo1)), "lat":geo1.getLatitude(), "lng":geo1.getLongitude()};
		} else {
			return {"dist":bdccGeoRadiansToMeters(this.distance(geo2)), "lat":geo2.getLatitude(), "lng":geo2.getLongitude()};
		}
	    }*/
        }

        // distance in meters from GLatLng point to Polyline (poliline egy lista a pontok lat+lng-ivel)
	//Ez az, amire szükségünk van
        function bdccGeoDistanceToPolyMtrs(poly, p)
        {
            var d = Number.MAX_VALUE;
            var i;
	    var minlat, minlng, FormerPointInLine;
            var p = new bdccGeo(p.lat,p.lng);
            for(i=0; i<(poly.length-1); i++)
                 {
                    var p1 = poly[i];
                    var l1 = new bdccGeo(p1[1],p1[0]);
                    var p2 = poly[i+1];
                    var l2 = new bdccGeo(p2[1],p2[0]);
		    var ret=p.distanceToLineSegMtrs(l1,l2);
                    var dp = ret.dist;
                    if(dp < d) { //Minker
                        d = dp; 
			minlat=ret.lat;
			minlng=ret.lng;
			FormerPointInLine=p1;
		    }   
                 }
		/*console.log(minlat);
		console.log(minlng);
		console.log(FormerPointInLine[1]);
		console.log(FormerPointInLine[0]);*/
             return {"lat":minlat,"lng":minlng, "formerLat": FormerPointInLine[1], "formerLng":FormerPointInLine[0]};
        }

// REGISTER OUR ROUTES ------------------------------- 
// all of our routes will be prefixed with /api
app2.use('/api', router);

// START THE SERVER
// =============================================================================
app2.listen(port);

