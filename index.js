const express = require('express'),
    app = express(),
    cors = require('cors');

app.use(cors());

app.get('/ping', function(req, res) {
    console.log(req.headers);
    let text = {text: 'Server is running.'};
    res.send(text);
});

app.listen(3000);