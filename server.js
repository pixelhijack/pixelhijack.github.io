var http = require('http');
var path = require('path');
var express = require('express');

var app = express();
var server = http.createServer(app);

app.use(express.static(path.resolve(__dirname)));
app.use(express.static(path.resolve(__dirname, 'assets')));

app.get('/*', function (req, res) {
  console.info('[/*]', req.params);
  res.sendFile('index.html', { root: path.join(__dirname)   });
});

server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});