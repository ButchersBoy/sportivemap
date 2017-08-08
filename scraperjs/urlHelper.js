function addProxy(url) {
	try {
		var private = require("./.settings/private")
        return {
            url: url,
            proxy: private.proxy
        }
	}
	catch(err) {
        console.log("Proxy settings not found ("+err+")")
		return url
	}	
}

module.exports = { addProxy: addProxy };