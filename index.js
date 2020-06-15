const express = require('express'),
    app = express(),
    cors = require('cors');

app.use(cors());

app.get('/ping', function(req, res) {
    console.log(req.headers);
    res.send('Server is running.');
});

app.listen(3000);