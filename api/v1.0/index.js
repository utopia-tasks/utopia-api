var express = require('express');
var router = express.Router();

router.get('/ping', function (req, res) {
	console.log(req.headers);
	let text = {text: 'Server is running.'};
	res.send(text);
});

module.exports = router;

