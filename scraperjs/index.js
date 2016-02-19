'option strict'

var fs = require("fs");
var request = require("request");
var readline = require('readline');
var jsdom = require("jsdom");

console.log('here we go');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var jquery = fs.readFileSync("./bin/jquery.js", "utf-8");


/*
var requestOptions = {
    url: 'https://www.britishcycling.org.uk/events?search_type=upcomingevents&zuv_bc_event_filter_id[]=5&resultsperpage=1000', 
    method: "GET",     
    //proxy: 'http://917753:AliceW_1@ncproxy1:8080',
    json: false
};

request(requestOptions, function (error, response, body) {
	if (!error && response.statusCode == 200) {

		jsdom.env({
			html : body,
			src : [jquery],			
			done : function (err, window) {
				if (err)
					console.log(err)
				else
				{
					parseBritishCycling(window, 'https://www.britishcycling.org.uk');					
				}
			}
		});   					
	}
	else if (error) {
		console.log(error);
	}
	rl.close();  	
});
*/


var requestOptions = {
    url: 'http://www.ukcyclingevents.co.uk/events/category/road', 
    method: "GET",     
    //proxy: 'http://917753:AliceW_1@ncproxy1:8080',
    json: false
};

request(requestOptions, function (error, response, body) {
	if (!error && response.statusCode == 200) {

		jsdom.env({
			html : body,
			src : [jquery],			
			done : function (err, window) {
				if (err)
					console.log(err)
				else
				{
					parseUkCyclingEvents(window, 'http://www.ukcyclingevents.co.uk');					
				}
			}
		});   					
	}
	else if (error) {
		console.log(error);
	}
	rl.close();  	
});




rl.question("Enter to exit > ", function(answer) {
  console.log("End:", answer);
  rl.close();
});

function Event(name, date, kind, locationSummary, indexerUrl) {
	this.name = name;
	this.date = date;
	this.kind = kind;
	this.locationSummary = locationSummary;
	this.indexerUrl = indexerUrl;
}
Event.prototype.toJSON = function() {
	return JSON.stringify({
		name : this.name,
		date : this.date,
		kind : this.kind,
		locationSummary : this.locationSummary,
		indexerUrl : this.indexerUrl
	});
}



function readJSON(filename){
  return new Promise(function (fulfill, reject){
    readFile(filename, 'utf8').done(function (res){
      try {
        fulfill(JSON.parse(res));
      } catch (ex) {
        reject(ex);
      }
    }, reject);
  });
}


function parseUkCyclingEvents(window, indexerRootUrl) {
	var pages = window.$("ul.thumbnails:first a").map(function(index, a) {
		return (indexerRootUrl + a.href);
	});
	console.log(pages[0]);
}

function parseBritishCycling(window, indexerUrlPrefix)
{	
	var events = window.$("tr.events--desktop__row:has(td)").map(function(index, tr) {				
		var event = new Event(
			window.$("td.table__more-cell", tr).text().clean(),
			window.$("td.event--date__column", tr).text().clean(),			
			window.$("td.event--type__row", tr).text().clean(),						 
			window.$("td:not([class]):last", tr).text().clean(),
			indexerUrlPrefix.concat(window.$("td.events--event__column > a", tr).attr('href')).clean()
		); 
		return event; 		
	})
	
	console.log("Item count: " + events.length);
	
	console.log(events[5].name);
	console.log(events[5].date);
	console.log(events[5].kind);
	console.log(events[5].locationSummary);
	console.log(events[5].indexerUrl);
	
	console.log(events[5].toJSON());
}

String.prototype.clean = function() {
	return this.trim().replace('/r', '/');
}