var express = require("express");
const os = require("os");
var fileSystem = require("fs");
const path = require("path");

var app = express();



app.use(express.json());





const BackendVersion = "1.0.2";
const FrontendVersion="1.2.1";



const MainAPI = require("./testapi.js");
var exec = require('child_process').exec, child;


//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./backend/"));



 
const hostname = "127.0.0.1";
const port = 8877;

app.get("/up", function (req, res) {
  console.log("post 7");
  console.log(req.url);
  MainAPI.postapi();

  


  //res.sendFile(path.join(__dirname, "/index1.html"));

});


app.use("/api/update", function (req, res) {
  console.log("post up...........................11");
  console.log("post up...........................22");
  
  MainAPI.postapi();

  res.send('update..');
});




var server = app.listen(port, function () {
    console.log("Node server is running ver 77...");
    console.log('Hostname : ' + os.hostname());
  console.log('OS Type : ' + os.type());
  console.log('Platform : ' + os.platform());

  
      MainAPI.firebasedbtest();

  });

  