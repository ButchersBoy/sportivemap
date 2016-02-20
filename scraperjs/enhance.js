'option strict'

var fs = require("fs");

console.log(Date.parse("Sun 30/10/16"));
console.log(Date.parse("Wednesday 22nd June 2016"));
console.log(Date.parse("Sat 02/07/16\n- Sun 03/07/16"));

var text = fs.readFileSync("dataraw.js",  'utf8');
var events = JSON.parse(text);
console.log(events.length);