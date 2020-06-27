const {Pool} = require('pg'),
	pool = new Pool(),
	path = require('path'),
	fs = require('fs');

pool.connect((err, client, release) => {
	if (err) {
		return console.error('Error acquiring client', err.stack);
	}

	const directoryPath = path.join(__dirname, 'sql');
	fs.readdir(directoryPath, function (err, files) {
		if (err) {
			return console.log('Unable to scan directory: ' + err);
		}
		const sortedFiles = files.sort();
		console.log(sortedFiles);
		let i = 0;
		for (let i = 0; i < sortedFiles.length; i++) {
			let data = fs.readFileSync(directoryPath + '/' + sortedFiles[i], 'utf8');
			if (err) {
				return console.log(`Unable to read file (${sortedFiles[i]}): ${err}`);
			}
			client.query(data, (err, result) => {
				if (err) {
					return console.error('Error executing query', err.stack)
				}
				console.log(result);
			})
		}
	});
	release();
});