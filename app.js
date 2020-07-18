const express = require('express'),
	app = express(),
	cors = require('cors'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	https = require('https'),
	fs = require('fs');
const port = 3000;
const options = {
	key: fs.readFileSync('sslcert/key.pem'),
	cert: fs.readFileSync('sslcert/cert.pem')
};

app.use(cors({ origin: 'https://127.0.0.1:4200' , credentials :  true}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/api', require('./api'));
const server = https.createServer(options, app);

server.listen(port, function () {
	console.log(`Utopia NodeJS Server listening at https://localhost:${port}`);
});