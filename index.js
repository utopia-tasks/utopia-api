const express = require('express'),
    app = express();

app.get('/ping', function(req, res) {
    console.log(req);
    res.send('Server is running.');
});

app.listen(3000);