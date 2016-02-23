'option strict'

var fs = require("fs");
var request = require("request")
var Promise = require("bluebird");
Promise.promisifyAll(require("request"));

function parseDateMethodOne(input) {
	var regex = /(\d+)/g;
	var matches, output = [];
	while (matches = regex.exec(input)) {
	    output.push(matches[1]);
	}
	if (output.length == 3 || output.length == 6)
	{		
		if (output.length == 3 &&  input.indexOf('&') != -1)
			return null;
		
		var day = output[0];
		var month = output[1];
		var year = output[2];
		if (year.length==2) year = "20"+year;

		return new Date(year, month-1, day);
	}
	return null;
}

var months = "January|February|March|April|May|June|July|August|September|October|November|December";
var monthsArray = months.split("|");

function parseDateMethodTwo(input) {
	var regex = /(\d+)/g;
	var matches, output = [];
	while (matches = regex.exec(input)) {
	    output.push(matches[1]);
	}
	if  (output.length >= 2) {
		var monthMatch = new RegExp(months, 'i').exec(input);
		if (monthMatch)
		{
			var day = output[0];
			var month = monthsArray.indexOf(monthMatch[0]);
			var year = output[1];
			if (year.length==2) year = "20"+year;

			return new Date(year, month, day);
		}
	}
	return null;
}

function parseDate(input) {
	return parseDateMethodOne(input) || parseDateMethodTwo(input);
}

var text = fs.readFileSync("dataraw.js",  'utf8');
var events = JSON.parse(text);
console.log("Events loaded: " + events.length);

text = fs.readFileSync("enhance-overrides.json",  'utf8');
var overrides = JSON.parse(text);
var overridesMap = new Map();
for (var index = 0; index < overrides.length; index++) {
    overridesMap.set(overrides[index].name, overrides[index].geoCodeThis);        
}
console.log("Overrides loaded: " + overridesMap.size);


var filteredEvents = new Array();

for (var i = events.length - 1; i >= 0; i--) {
	var properDate = parseDate(events[i].dateSummary);
	if (!properDate)
	{
		console.log("WARN! Unable to parse [" + events[i].dateSummary + "] at index " + i  + " for event " + events[i].name);
		continue;
	}
	events[i].date = properDate;
	filteredEvents.push(events[i]);
};

console.log("Remaining after date parse: " + filteredEvents.length);

function failedEventItem(name, date, geoCodeUrl) {
	this.name = name;
    this.date = date;
	this.geoCodeUrl = geoCodeUrl;	
}

function logGeoLocationFail(event, geoCodeUrl, failedEventItems) {
	var evStr = JSON.stringify(event);
	console.log("Unable to geo locate:");
	console.log(evStr);
	console.log("Request was:");
	console.log(geoCodeUrl);
	failedEventItems.push(new failedEventItem(event.name, event.date, geoCodeUrl));
}

function getNextGeoLoc(events, index, failedEventItems, resolve) {	    
    var urlPrefix = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCMReQsiiLJ4_q-aIiqzunOwwNXsr29sIo&address=";
    var urlSuffix = overridesMap.get(events[index].name);
    if (urlSuffix == undefined)
        urlSuffix = events[index].locationSummary.replace(/\n/g, ",");
    var geoCodeUrl = urlPrefix.concat(urlSuffix);	

	request.getAsync(geoCodeUrl)
		.then(function(response) {

			if (!response.body) {                
				logGeoLocationFail(events[index], geoCodeUrl, failedEventItems);
				return;
			};                            

			var geo = JSON.parse(response.body);

			if (!geo.results || geo.results.length == 0) {
                console.log(response.body);
				logGeoLocationFail(events[index], geoCodeUrl, failedEventItems);
				return;
			};

			events[index].formattedAddress = geo.results[0].formatted_address;
			events[index].geometryLocation = geo.results[0].geometry.location;
		})
		.then(function() {
			if (++index == events.length)
				resolve(events, failedEventItems);
			else
				setTimeout(function() {
					getNextGeoLoc(events, index, failedEventItems, resolve);
				}, 2);
		})
        .catch(function(e) {
            console.log('error');
            console.log(e);
            // this also returns equivalent to Promise.resolve(undefined);
            // to propagate the "error" condition, you want to either throw e, or return Promise.reject(something here);
        });
}

//332 will fail for quick testing
getNextGeoLoc(filteredEvents, 332, new Array(), function(events, failedEventItems) {
	fs.writeFileSync('data-uk.json', JSON.stringify(events), 'utf8');
	fs.writeFileSync('data-uk-failed.json', JSON.stringify(failedEventItems), 'utf8');
	console.log("Geo locating finished.");
})