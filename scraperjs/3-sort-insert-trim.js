
var fs = require("fs");


var text = fs.readFileSync("3-additional-input.json",  'utf8');
var additionalData = JSON.parse(text);
console.log("Manual entries to add: " + additionalData.addEntries.length);
console.log("Manual entries to remove: " + additionalData.removeEntries.length);


text = fs.readFileSync("data-uk.json",  'utf8');
var events = JSON.parse(text);
console.log("Loaded existing: " + events.length);
//console.log(events[0]);

additionalData.addEntries.forEach((ev) => {
	console.log("Adding manual entry " + ev.name);
	events.push(ev);	
}, this);

events.sort(function(a, b) {
    return Date.parse(a.date).valueOf() - Date.parse(b.date).valueOf();
});

console.log("Sorted: " + events.length);

function removeUrlCharacters(text) {
	return text.replace(/\//g, "-").replace(/ /g, "-").replace(/&/g, "-and-").replace(/\?/g, "-").replace(/#/g, "-");
}

for (var i = events.length - 1; i >= 0; i--) {
	events[i].namePath = removeUrlCharacters(events[i].name);
};

/*
for (var i = events.length - 1; i >= 0; i--) {
	console.log(events[i].date);
};
*/

fs.writeFileSync('data-uk-sorted.json', JSON.stringify(events), 'utf8');