var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
	var file = __dirname + "/../" + req.baseUrl;
	file = path.resolve(file);
	res.sendFile(file);
});

module.exports = router;