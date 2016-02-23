'option strict'

//script orders :
//index.js
//enhance.js
//sort.js

var fs = require("fs");
var readline = require('readline');
var jsdom = require("jsdom");
var request = require("request");
var Promise = require("bluebird");
Promise.promisifyAll(require("request"));

String.prototype.clean = function() {
	return this.trim().replace(/\r/g, '').replace(/\t/g, '').replace(/\n/g, '').replace("View map", '');
}

var jquery = fs.readFileSync("./bin/jquery.js", "utf-8");

var allEvents = new Array();

function manageUkCyclingEvents(allEvents, then) {
	request
		.getAsync('http://www.ukcyclingevents.co.uk/events/category/road')
		.then(function(response){
			jsdom.env({
						html : response.body,
						src : [jquery],			
						done : function (err, window) {
							if (err)
								console.log(err)
							else
							{
								console.log("Running UK Cycling...");
								var urls = window.$.makeArray(window.$("ul.thumbnails:first a").map(function(index, a) {		
									return ('http://www.ukcyclingevents.co.uk' + a.href);
								}));

								fetxhNextUkCyclingEvent(urls, allEvents, then);
							}
						}
					});
		});
}

function manageBritishCyclingEvents(intoEvents, then) {
    	request
		.getAsync('https://www.britishcycling.org.uk/events?search_type=upcomingevents&zuv_bc_event_filter_id[]=5&resultsperpage=1000')
		.then(function(response){
			jsdom.env({
						html : response.body,
						src : [jquery],			
						done : function (err, window) {
							if (err)
								console.log(err)
							else
							{                                                                
								console.log("Running initial British cycling parse...");                                
                                parseBritishCycling(window, "https://www.britishcycling.org.uk", intoEvents);
                                then(intoEvents);                                                                
							}
						}
					});
		});
}

function handleEndResult(allEvents) {
	console.log("END "  + allEvents.length);	
	fs.writeFileSync('dataraw.js', JSON.stringify(allEvents), 'utf8');
}

function Event(name, dateSummary, kind, locationSummary, indexerUrl) {
	this.name = name;
	this.dateSummary = dateSummary;
	this.kind = kind;
	this.locationSummary = locationSummary;
	this.indexerUrl = indexerUrl;
}

Event.prototype.toJSON__ = function() {
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

function fetxhNextUkCyclingEvent(urls, intoEvents, then) {
	var url = urls.pop();
	if (url == undefined) {
		then(intoEvents);
		return;
	}

	requestPromise(url).then(function(response) {
		parseUkCyclingEvent(response.body, url, intoEvents);
		fetxhNextUkCyclingEvent(urls, intoEvents, then);
	});
}

function parseUkCyclingEvent(html, sourceUrl, intoEvents) {
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

					intoEvents.push(event);
				}
				else
				{
					console.log("Cannot scrape " + sourceUrl);
				}				
			}
		}
	});   					
}

function parseBritishCycling(window, indexerUrlPrefix, intoEvents)
{	
	var events = window.$("tr.events--desktop__row:has(td)").map(function(index, tr) {				
		        
        var url = indexerUrlPrefix.concat(window.$("td.events--event__column > a", tr).attr('href'))
            .clean()
            .replace("https://www-britishcycling-org-uk", "");        
        
        var event = new Event(
			window.$("td.table__more-cell", tr).text().clean(),
			window.$("td.event--date__column", tr).text().clean(),			
			window.$("td.event--type__row", tr).text().clean(),						 
			window.$("td:not([class]):last", tr).text().clean(),
			url
		); 
		return event; 		
	})

	for (var i = events.length - 1; i >= 0; i--) {
		intoEvents.push(events[i]);
	};
}

function enhanceNextBritishCyclingEvent(events, index, then) {
    requestPromise(events[index].indexerUrl)
        .then(response => {
            jsdom.env({
                html : response.body,
                src : [jquery],			
                done : function (err, window) {
                    console.log("Enhanching British event " + index)
                    if (err)
                        console.log(err)
                    else			
                    {	
                        var address = window.$("div#event_details_tabs>div:nth-child(2)>div>div:nth-child(4)>div:nth-child(1)>dl>dd:nth-child(8)>p").text().clean();                        
                        if (address)
                        {                            
                            events[index].locationSummary = address;                                                        
                        }                                                    
                    }
                    
                    if (++index == events.length) {
                        then(events);
                    } else {
                        setTimeout(() => {
                            enhanceNextBritishCyclingEvent(events, index, then);    
                        }, 25)                                        
                    }
                }
            });   
            
        });
}


console.log("British cycling events...");
var allEvents = new Array();
manageBritishCyclingEvents(allEvents, bEv1 => {
    console.log("British events: " + bEv1.length);
    enhanceNextBritishCyclingEvent(allEvents, 0, bEv2 => {
        
        console.log("British cycling done!  UK Cycling...");
        
        manageUkCyclingEvents(allEvents, handleEndResult);
    });        
});

/*
request
	.getAsync("https://www.britishcycling.org.uk/events?search_type=upcomingevents&zuv_bc_event_filter_id[]=5&resultsperpage=1000")
	.then(function(response) {
		jsdom.env({
			html : response.body,
			src : [jquery],			
			done : function (err, window) {
				if (err)
					console.log(err)
				else
				{
					parseBritishCycling(window, "https://www.britishcycling.org.uk", allEvents);
					console.log("Current count  " +  allEvents.length);
					console.log("UK cycling...");
					manageUkCyclingEvents(allEvents, handleEndResult);
				}
			}
		});
	});

*/