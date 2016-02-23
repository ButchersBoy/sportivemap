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
	if  (output.length == 2) {
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

function logGeoLocationFail(event, geoCodeUrl) {
	var evStr = JSON.stringify(event);
	console.log("Unable to geo locate:");
	console.log(evStr);
	console.log("Request was:");
	console.log(geoCodeUrl);
}

function getNextGeoLoc(events, index, resolve) {
	console.log("Geo locating " + index)
	var geoCodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCMReQsiiLJ4_q-aIiqzunOwwNXsr29sIo&address=";
	geoCodeUrl += events[index].locationSummary.replace(/\n/g, ",");

	request.getAsync(geoCodeUrl)
		.then(function(response) {

			if (!response.body) {
				logGeoLocationFail(events[index], geoCodeUrl);
				return;
			};

			var geo = JSON.parse(response.body);

			if (!geo.results || geo.results.length == 0) {
				logGeoLocationFail(events[index], geoCodeUrl);
				return;
			};

			events[index].formattedAddress = geo.results[0].formatted_address;
			events[index].geometryLocation = geo.results[0].geometry.location;
		})
		.then(function() {
			if (++index == events.length)
				resolve(events);
			else
				setTimeout(function() {
					getNextGeoLoc(events, index, resolve);
				}, 1000);
		});
}

var testEvents = new Array();
testEvents[0] = filteredEvents[61];

getNextGeoLoc(testEvents, 0, function(events) {
	fs.writeFileSync('data-uk.js', JSON.stringify(events), 'utf8');
	console.log("Geo locating finished.");
})