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

var geoCodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyCMReQsiiLJ4_q-aIiqzunOwwNXsr29sIo&address=";
geoCodeUrl += filteredEvents[0].locationSummary.replace(/\n/g, ",");

console.log(geoCodeUrl);

request.getAsync(geoCodeUrl)
	.then(function(response) {
		var geo = JSON.parse(response.body);
		filteredEvents[0].formattedAddress = geo.results[0].formatted_address;
		filteredEvents[0].geometryLocation = geo.results[0].geometry.location

		console.log(filteredEvents[0]);

		return response;
	});

//https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=

//AIzaSyCMReQsiiLJ4_q-aIiqzunOwwNXsr29sIo

//API key  AIzaSyCMReQsiiLJ4_q-aIiqzunOwwNXsr29sIo

//var date1 = parseDate(input4);
//console.log(date1);


/*
while (match !=  null) {

RegExp.

	match = 
}
console.log(groups[2]);	

console.log(Date.parse("Sun 30/10/16"));
console.log(Date.parse("Wednesday 22nd June 2016"));
console.log(Date.parse("Sat 02/07/16\n- Sun 03/07/16"));

console.log(Date.parse("22 June 2016").toString());

var text = fs.readFileSync("dataraw.js",  'utf8');
var events = JSON.parse(text);
console.log(events.length);
*/