const express = require('express'),
	router = express.Router(),
	{Pool} = require('pg'),
	{v4: uuidv4} = require('uuid'),
	userDetails = require('./user_details');

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
				return console.error('Error executing query', err.stack);
			}
			res.status(200).send('User created successfully');
		})
	})
});

router.post('/login', function (req, res) {
	pool.connect((err , client, release) => {
		if (err) {
			res.status(404).send('Unable to verify user credentials');
			return console.error('Error acquiring client', err.stack);
		}
		const query = 'SELECT l.user_guid FROM user_info.user_login l, user_info.user_details d ' +
			'WHERE l.user_guid = d.user_guid and (l.username = $1 OR d.email = $1) and password = crypt($2, password)';
		const vars = [req.body.username, req.body.password];
		console.log('Validating user with: ' + query);
		client.query(query, vars, (err, result) => {
			if (err) {
				res.status(404).send('Unable to verify user credentials');
				return console.error('Error executing query', err.stack);
			}
			if(result.rows.length === 0) {
				res.status(401).send('Invalid Credentials');
			} else {
				const query2 = 'SELECT * FROM generateCookies($1::text, $2::text, $3::text)';
				const token = uuidv4();
				const sessionid = uuidv4();
				const vars2 = [result.rows[0]['user_guid'], token, sessionid];
				console.log(`[${result.rows[0]['user_guid']}]: Generating cookies`);
				client.query(query2, vars2, (err, result) => {
					release();
					if (err) {
						res.status(404).send('User cannot be signed in right now');
						return console.error('Error executing query', err.stack);
					}
					if(!result.rows[0]['generatecookies']) {
						res.status(500).send('Cookies not generated');
						return console.error('Error executing query', err.stack);
					}
					res.cookie('TOKEN', token);
					res.cookie('SESSIONID', sessionid);
					res.status(200).send('Valid credentials');

				});
			}
		})
	})
});

router.post('/cookies', function (req, res) {
	let cookies = req.cookies;
	console.log(cookies);
	pool.connect((err , client, release) => {
		if (err) {
			res.status(404).send('Cookie cannot be verified right now');
			return console.error('Error acquiring client', err.stack);
		}
		const query = 'SELECT * FROM generateLoginCookie($1::text, $2::text)';
		const guid = uuidv4();
		const vars = [req.cookies['TOKEN'], guid];
		console.log('Generating new login cookie with: ' + query);
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

router.get('/tasks', function (req, res) {
	let token = req.cookies['TOKEN'];
	if(!token) {
		res.status(401).send('Token missing');
	}
	pool.connect((err, client, release) => {
		if (err) {
			res.status(404).send('Cannot be retrieve tasks right now');
			return console.error('Error acquiring client', err.stack);
		}
		const query = 'SELECT * FROM task_info.task_details WHERE user_guid IN (SELECT user_guid FROM cookie.login WHERE token = $1::text)';
		const vars = [token];
		console.log('Retrieving tasks with: ' + query);
		client.query(query, vars, (err, result) => {
			release();
			if (err) {
				res.status(404).send('Tasks cannot be retrieved');
				return console.error('Error executing query', err.stack)
			}
			res.send(result.rows);
		})
	})

});

module.exports = router;

