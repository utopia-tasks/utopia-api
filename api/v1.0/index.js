const express = require('express'),
	router = express.Router(),
	{Pool} = require('pg'),
	{v4: uuidv4} = require('uuid');

const pool = new Pool();

router.post('/user', function (req, res) {
	pool.connect((err , client, release) => {
		if (err) {
			res.status(404).send('User cannot be made');
			return console.error('Error acquiring client', err.stack);
		}
		const query = 'SELECT * FROM createAccount($1::text, $2, $3, $4, $5, $6, $7, $8)';
		const guid = uuidv4();
		const vars = [guid, req.body.username, req.body.password, req.body.firstName, req.body.lastName, req.body.email, req.body.language, req.body.offsetHours];
		console.log('Creating user with: ' + query);
		client.query(query, vars, (err, result) => {
			release();
			if (err) {
				res.status(404).send('User cannot be made');
				return console.error('Error executing query', err.stack)
			}
			res.send(result.rows);
		})
	})
});

router.get('/user?:id', function (req, res) {
	pool.connect((err, client, release) => {
		if (err) {
			return console.error('Error acquiring client', err.stack);
		}
		console.log(req.cookies);
		const query = 'SELECT * FROM user_info.user_details WHERE user_guid = $1::text';
		console.log('Running query: ' + query);
		client.query(query, [req.query.id], (err, result) => {
			release();
			if (err) {
				res.send('User not found');
				return console.error('Error executing query', err.stack)
			}
			res.send(result.rows);
		})
	})
});

router.get('/ping', function (req, res) {
	console.log(req.headers);
	let text = {text: 'Server is running.'};
	res.send(text);
});

module.exports = router;

