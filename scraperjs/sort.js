
var fs = require("fs");

var text = fs.readFileSync("data-uk.js",  'utf8');
var events = JSON.parse(text);
console.log(events.length);
console.log(events[0]);

events.sort(function(a, b) {
    return Date.parse(a.date).valueOf() - Date.parse(b.date).valueOf();
});

console.log("sorted.");

for (var i = events.length - 1; i >= 0; i--) {
	console.log(events[i].date);
};

fs.writeFileSync('data-uk-sorted.json', JSON.stringify(events), 'utf8');