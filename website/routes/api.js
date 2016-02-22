var express = require('express');
var router = express.Router();
var path = require('path');

router.post("/list/:location", function(req, res, next) {	
	{	
		if (req.params.location == "uk")
		{							
			var file = path.resolve(__dirname+"/../data/list-uk.json");
			res.sendFile(file);			
		}
		else
		{
			res.send();
		}		
	}
});

module.exports = router;