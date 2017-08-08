/*
function prepareUrl(url) {
	try {
		var private = require("./.settings/private")
        return {
            url: url,
            proxy: "your::proxy"
        }
	}
	catch(err) {
        console.log("Proxy settings not found ("+err+")")
		return url
	}	
}
*/

var urlHelper = require("./urlHelper.js")
var yo = urlHelper.addProxy("www.google.com")

console.log(yo)