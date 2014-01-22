var express = require('express');
var path = require('path');
var app = express();

app.get('/', function(req, res) {
    res.redirect("/build/settings.html");
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '/build')));
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
}));


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});