'option strict'

var fs = require("fs");
var readline = require('readline');
var jsdom = require("jsdom");
var request = require("request");
var Promise = require("bluebird");
Promise.promisifyAll(require("request"));

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

var requestPromise = Promise.method(function(url) {
	console.log("get " + url);
	return request.getAsync(url).then(function(response) {
		console.log("received " + url);
		return response;
	});
});


function parseUkCyclingEvents(window, indexerRootUrl) {
	var urls = window.$.makeArray(window.$("ul.thumbnails:first a").map(function(index, a) {		
		return (indexerRootUrl + a.href);
	}));

	fetxhNextUkCyclingEvent(urls);

	//Promise.each(promises, function(item, index, length) {
	//	parseUkCyclingEvent(item.body, item.request.uri.href);
	//});

	/*
	var promises = window.$.makeArray(window.$("ul.thumbnails:first a").map(function(index, a) {		
		return (request.getAsync(indexerRootUrl + a.href));
	}));


	Promise.all(promises).then(values =>
	{
		for (var i = 0; i < values.length; i++) {
			parseUkCyclingEvent(values[i].body, values[i].request.uri.href);
		};				
	});
	*/	
}

function fetxhNextUkCyclingEvent(urls) {
	var url = urls.pop();
	if (url == undefined) return;

	requestPromise(url).then(function(response) {
		parseUkCyclingEvent(response.body, url);
		fetxhNextUkCyclingEvent(urls);
	});
}

function parseUkCyclingEvent(html, sourceUrl) {
	jsdom.env({
		html : html,
		src : [jquery],			
		done : function (err, window) {
			if (err)
				console.log(err)
			else			
			{	
				var name = window.$("body>div:nth-child(4)>div:nth-child(3)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>h3").text().clean();
				var event;
				if (name != "")
				{
					event = new Event(
						name,
						window.$('dl.event-details dt:contains("Date") ~ dd:first').text().clean(),
						"Road",
						window.$('dl.event-details dt:contains("Venue") ~ dd:first').text().clean(),
						sourceUrl
						);

					console.log(event.toJSON());
				}
				else
				{
					console.log("Cannot scrape " + sourceUrl);

				}				

				//console.log(event.toJSON());
			}
		}
	});   					
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