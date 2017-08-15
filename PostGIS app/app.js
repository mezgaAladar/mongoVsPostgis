#!/usr/bin/env node

var pg = require("pg");
var express = require('express');
var bodyParser = require('body-parser');
var geolib = require('geolib');
var app = express();

var port = process.env.PORT || 3001; 

app.use(bodyParser());
app.set('view engine', 'jade');

var conString = "pg://paxi58:Car0nfl5@localhost:5432/postgres";

var client = new pg.Client(conString);
client.connect();


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

//WARMUP
router.route('/warmup-rivers')
	.get(function(req, res) {
		var query = client.query("SELECT * FROM rivers");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json({kész:"READY"});
		});
	  });

router.route('/warmup-cities')
	.get(function(req, res) {
		var query = client.query("SELECT * FROM cities");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json({kész:"READY"});
		});
	  });

router.route('/warmup-countries')
	.get(function(req, res) {
		var query = client.query("SELECT * FROM countries");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json({kész:"READY"});
		});
	  });

router.route('/warmup-pontok')
	.get(function(req, res) {
		var query = client.query("SELECT * FROM pontok");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result);
		});
	  });

router.route('/warmup-waterways')
	.get(function(req, res) {
		var query = client.query("SELECT * FROM waterways");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json({kész:"READY"});
		});
	  });

//Boundary box queries
router.route('/CntcitiesBbox/:xyxy')
	.get(function(req, res) {
		console.time("countBboxCity");
		var bbox = new Array();
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		var query = client.query("SELECT count(*) FROM waterways where ST_Within(geom, ST_MakeEnvelope("+parseFloat(bbox[1])+","+parseFloat(bbox[0])+","+parseFloat(bbox[3])+","+parseFloat(bbox[2])+",4326))");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd("countBboxCity");
		});
        });

router.route('/CntWaterwaysBbox/:xyxy')
	.get(function(req, res) {
		console.time("countBboxCity");
		var bbox = new Array();
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		var query = client.query("SELECT count(*) FROM waterways where ST_Within(geom, ST_MakeEnvelope("+parseFloat(bbox[1])+","+parseFloat(bbox[0])+","+parseFloat(bbox[3])+","+parseFloat(bbox[2])+",4326))");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd("countBboxCity");
		});
        });

router.route('/citiesBbox/:xyxy')
	.get(function(req, res) {
		console.time("BboxCity");
		var bbox = new Array();
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		var query = client.query("SELECT gid,city_name,gmi_admin,admin_name,fips_cntry,cntry_name,status,pop_rank,pop_class,port_id, ST_AsText(geom) FROM cities where ST_Within(geom, ST_MakeEnvelope("+parseFloat(bbox[1])+","+parseFloat(bbox[0])+","+parseFloat(bbox[3])+","+parseFloat(bbox[2])+",4326))");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd("BboxCity");
		});
        });

router.route('/CntpontokBbox/:xyxy')
	.get(function(req, res) {
		console.time("countBboxPont");
		var bbox = new Array();
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		var query = client.query("SELECT count(*) FROM pontok where ST_Within(geom, ST_MakeEnvelope("+parseFloat(bbox[1])+","+parseFloat(bbox[0])+","+parseFloat(bbox[3])+","+parseFloat(bbox[2])+",4326))");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd("countBboxPont");
		});
        });

router.route('/pontokBbox/:xyxy')
	.get(function(req, res) {
		console.time("BboxPont");
		var bbox = new Array();
		if (typeof req.params.xyxy === "undefined") {
			bbox[0]=47;
			bbox[1]=18;
			bbox[2]=48;
			bbox[3]=18.5;
			console.log("U should set some coordinates in the url");
		} else {
			bbox = req.params.xyxy.split("-");
		}
		var query = client.query("SELECT gid, osm_id, timestamp, name, type, ST_AsText(geom) FROM pontok where ST_Within(geom, ST_MakeEnvelope("+parseFloat(bbox[1])+","+parseFloat(bbox[0])+","+parseFloat(bbox[3])+","+parseFloat(bbox[2])+",4326))");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd("BboxPont");
		});
        });

//Within query
router.route('/within/rivers/:country')
	.get(function(req, res) {
		console.time("Within");
		var cntryGeom;
		var query = client.query("SELECT rivers.gid,name, ST_AsText(rivers.geom) FROM rivers, countries where ST_Within(rivers.geom, countries.geom) and countries.iso_3digit = '"+req.params.country+"'");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('Within');
		});
        });

router.route('/intersects_/countries/:riv')
	.get(function(req, res) {
		console.time("RivInterCountry");
var query = client.query("SELECT countries.gid, iso_2digit, iso_3digit, cntry_name, pop_cntry, ST_AsText(countries.geom) FROM countries INNER JOIN rivers ON ST_Intersects(rivers.geom, countries.geom) WHERE rivers.name='"+req.params.riv+"'");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('RivInterCountry');
		});
        });

//Intersect query
router.route('/intersects/rivers/:river')
	.get(function(req, res) {
		console.time("RivInterRiv");
var query = client.query("select r1.gid,r1.name, ST_AsText(r1.geom) from rivers r1, rivers r2 where r1.gid != r2.gid and ST_Intersects(r1.geom, r2.geom) and r1.name='"+req.params.river+"'");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('RivInterRiv');
		});
        });

//Near queries
router.route('/cities/closest/:loc')//Legközelebbi pont+táv
	.get(function(req, res) {
		console.time("colsestCity");
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
var query = client.query("SELECT gid,city_name,gmi_admin,admin_name,fips_cntry,cntry_name,status,pop_rank,pop_class,port_id, ST_AsText(geom), ST_Distance_sphere(geom, ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326)) as dist FROM cities ORDER BY geom <-> ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326) LIMIT 1;"); 
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('colsestCity');
		});
        });

router.route('/pontok/closest/:loc')//Legközelebbi pont+táv
	.get(function(req, res) {
		console.time("colsestpt");
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
var query = client.query("SELECT gid, osm_id, timestamp, name, type, ST_AsText(geom), ST_Distance_sphere(geom, ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326)) as dist FROM pontok ORDER BY geom <-> ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326) LIMIT 1;");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('colsestpt');
		});
        });

router.route('/countries/closest/:loc')//Legközelebbi pont+táv
	.get(function(req, res) {
		console.time("closestCountry");
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
var query = client.query("SELECT gid, iso_2digit, iso_3digit, cntry_name, pop_cntry, ST_AsText(geom), geom <#> ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326) as dist FROM countries ORDER BY geom <#> ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326) LIMIT 1;");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('closestCountry');
		});
        });

//Előző 3 query lassabb, de pontosabb lekérdezése:
router.route('/cities/closestAccurate/:loc')//Legközelebbi pont+táv
	.get(function(req, res) {
		console.time("colsestCity");
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
var query = client.query("SELECT gid,city_name,gmi_admin,admin_name,fips_cntry,cntry_name,status,pop_rank,pop_class,port_id, ST_AsText(geom), ST_Distance_Spheroid(geom, ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326), 'SPHEROID[\"WGS 84\",6372000,298.257222101]') as dist FROM cities ORDER BY dist LIMIT 1;");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('colsestCity');
		});
        });

router.route('/pontok/closestAccurate/:loc')//Legközelebbi pont+táv
	.get(function(req, res) {
		console.time("colsestpt");
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
var query = client.query("SELECT gid, osm_id, timestamp, name, type, ST_AsText(geom), ST_Distance_Spheroid(geom, ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326), 'SPHEROID[\"WGS 84\",6372000,298.257222101]') as dist FROM pontok ORDER BY dist LIMIT 1;");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('colsestpt');
		});
        });

router.route('/countries/closestAccurate/:loc')//Legközelebbi pont+táv
	.get(function(req, res) {
		console.time("closestCountry");
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
var query = client.query("SELECT gid, iso_2digit, iso_3digit, cntry_name, pop_cntry, ST_AsText(geom), ST_Distance_Spheroid(geom, ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326), 'SPHEROID[\"WGS 84\",6372000,298.257222101]') as dist FROM countries ORDER BY dist LIMIT 1;");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('closestCountry');
		});
        });

router.route('/cities/near/:loc') //Táv szerint sorbarendezve a legközelebbi városok
	.get(function(req, res) {
		console.time("nearCities");
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
		//A point és st_makepoint esetén is lon lat-ban kell megadni
var query = client.query("SELECT gid,city_name,gmi_admin,admin_name,fips_cntry,cntry_name,status,pop_rank,pop_class,port_id, ST_AsText(geom), ST_Distance_sphere(geom, ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326)) as dist FROM cities WHERE ST_DWithin(geom,Geography(ST_MakePoint("+parseFloat(location[1])+", "+parseFloat(location[0])+")),"+location[2]+") ORDER BY geom <-> ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326)");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('nearCities');
		});
        });

router.route('/pontok/near/:loc') //Táv szerint sorbarendezve a legközelebbi pontok
	.get(function(req, res) {
		console.time("nearPontok");
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
var query = client.query("SELECT gid, osm_id, timestamp, name, type, ST_AsText(geom), ST_Distance_sphere(geom, ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326)) as dist FROM pontok WHERE ST_DWithin(geom,Geography(ST_MakePoint("+parseFloat(location[1])+", "+parseFloat(location[0])+")),30000) ORDER BY geom <-> ST_GeometryFromText('POINT("+parseFloat(location[1])+" "+parseFloat(location[0])+")',4326)");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('nearPontok');
		});
        });

//LRS ------------------------------------------------

router.route('/line_locate_pt/:loc')
	.get(function(req, res) {
		console.time("locate_pt");
		if (typeof req.params.loc === "undefined") {
			location[0]=47;
			location[1]=19;
		} else {
			location = req.params.loc.split("-");
		}
		if (location.length<3) {
                         rivName="Danube";
		
                } else {
			rivName= location[2];
		}
		//A point és st_makepoint esetén is lon lat-ban kell megadni
		var query = client.query("SELECT ST_LineLocatePoint(ST_LineMerge(geom), ST_SetSRID(ST_MakePoint("+location[1]+", "+location[0]+"), 4326) ) from rivers where name='"+rivName+"'");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('locate_pt');
		});
	});

router.route('/line_interpolate_pt/:river')
	.get(function(req, res) {
		console.time("interpolate_pt");
		var rivGeom, river, ratio;
		if (typeof req.params.river === "undefined") {
			ratio=0.5;
			river= "Tisa";
		} else {
			var location = req.params.river.split("-");
			ratio=location[0];
			river=location[1];
		}
		//A point és st_makepoint esetén is lon lat-ban kell megadni
		var query = client.query("SELECT ST_AsText( ST_LineInterpolatePoint(ST_LineMerge(geom), "+ratio+" ) ) from rivers where name='"+river+"'");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('interpolate_pt');
		});
	});

router.route('/line_substring/:river')
	.get(function(req, res) {
		console.time("substr_pt");
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
		var query = client.query("SELECT ST_AsText( ST_Line_Substring(ST_LineMerge(geom), "+startFraction+", "+endFraction+" ) ) from rivers where name='"+river+"'");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    res.json(result.rows);
		    console.timeEnd('substr_pt');
		});
	});

//Nagy függvény
router.route('/lrs/:river')
	.get(function(req, res) {

		var rivGeom;
		var query = client.query("SELECT ST_AsText(geom) from rivers where name='"+req.params.river+"'");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    rivGeom = result.rows[0].st_astext;
		    var regExp = /\(([^)]+)\)/;
		    var inner = regExp.exec(rivGeom);
		    rivGeom=inner[1].replace('(','');
		    var geoms = rivGeom.split(/[ ,]+/);
		    var geomArr = [];
		    for (var c=0; c<geoms.length; c+=2) {
			geomArr.push([ geoms[c], geoms[c+1] ]);
		    } 
		    res.render('lrs', {river:req.params.river, coordinates:geomArr});
		});
		

        });

//Dolgozzuk fel a kapott LRS-t
app.post('/submitLRS', function(req,res){
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
	distHaversine(riverName, meretArr, res);	//Szerveren számol távot, saját haversine
})

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
	function renderelo() {
		res.render('lrsReturn', {river:riverName, coordinates:rivGeom, meretek:meretArr});
	}
	renderelo();
	console.timeEnd('LRS');
}

function getRiver(riverName, cb) {	/*Server-es számolásban használjuk*/

	var rivGeom;
	var query = client.query("SELECT ST_AsText(geom) from rivers where name='"+riverName+"'");
	query.on("row", function (row, result) {
	    result.addRow(row);
	});
	query.on("end", function (result) {
	    rivGeom = result.rows[0].st_astext;
	    var regExp = /\(([^)]+)\)/;
	    var inner = regExp.exec(rivGeom);
	    rivGeom=inner[1].replace('(','');
	    var geoms = rivGeom.split(/[ ,]+/);
	    var geomArr = [];
	    for (var c=0; c<geoms.length; c+=2) {
		geomArr.push([ geoms[c], geoms[c+1] ]);
	    } 
	    console.log(geomArr.length);
	    cb(geomArr);
	});
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
			P1[0] = P1[0].replace(/"/g,' ');	
			P1[1] = P1[1].replace(/"/g,'');
			P2[0] = P2[0].replace(/"/g,'');
			P2[1] = P2[1].replace(/"/g,'');
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
			// A /"/ g kell, hogy ne csak 1X cserélje:
			P1[0] = P1[0].replace(/"/g,' ');	
			P1[1] = P1[1].replace(/"/g,'');
			P2[0] = P2[0].replace(/"/g,'');
			P2[1] = P2[1].replace(/"/g,'');
			var distance = geolib.getDistance(
			    {latitude: P1[1], longitude: P1[0]}, 
			    {latitude: P2[1], longitude: P2[0]}
			);
			hosszok.push(distance);
		}
		interpolation(hosszok,riverName, meretArr,cbRivGeom, res);
	})
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

// REGISTER OUR ROUTES ------------------------------- 
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
