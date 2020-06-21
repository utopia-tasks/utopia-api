const express = require('express'),
	app = express(),
	cors = require('cors'),
	cookieParser = require('cookie-parser');
const port = 3000;

app.use(cors());
app.use(cookieParser());
app.use('/api', require('./api'));

app.listen(port, function () {
	console.log(`Utopia NodeJS Server listening at http://localhost:${port}`);
});