var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.redirect("build/settings.html");
});

app.use("/build", express.static(__dirname + '/build'));

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});