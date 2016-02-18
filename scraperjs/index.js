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

var requestOptions = {
    url: 'https://www.britishcycling.org.uk/events?search_type=upcomingevents&zuv_bc_event_filter_id[]=5&resultsperpage=1000', 
    method: "GET",     
    proxy: 'http://917753:AliceW_1@ncproxy1:8080',
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
					parseBritishCycling(window, 'https://www.britishcycling.org.uk/events');					
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

function parseBritishCycling(window, indexerUrlPrefix)
{
	
	var x = window.$("tr.events--desktop__row:has(td)").map(function(index, tr) {		
		var event = {
			name : window.$("td.table__more-cell", tr).text(),
			date : window.$("td.event--date__column", tr).text(),			
			kind : window.$("td.event--type__row", tr).text(),						 
			locationSummary : window.$("td:not([class]):last", tr).text(),
			indexerUrl : indexerUrlPrefix.concat(window.$("td.events--event__column > a", tr).attr('href'))
		}; 
		return event; 		
	})
	
	console.log("Item count: " + x.length);
	
	console.log(x[5].name);
	console.log(x[5].date);
	console.log(x[5].kind);
	console.log(x[5].locationSummary);
	console.log(x[5].indexerUrl);
	
	//console.log("contents of a.the-link:", window.$("tr.events--desktop__row:has(td)").text());
}