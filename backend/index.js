
//플랫폼 버전 백엔드 프론트엔드가 변경되면  업데이트 주석
const farmscubeplatformversion= 1.4;




var express = require("express");
var cors = require("cors");
const os = require("os");
var fileSystem = require("fs");
const path = require("path");

var app = express();


var backGlobal = require("./backGlobal");


app.use(express.json());
app.use(cors());





const BackendVersion = "1.0.2";
const FrontendVersion="1.2.1";



const MainAPI = require("./testapi.js");
var exec = require('child_process').exec, child;


//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./backend/"));


var myhostname=os.hostname();

MainAPI.firebasedbinit();

if (myhostname.indexOf("EC2-") != -1 ) {
  //AWS 사용할것이므로 서버 이름이 EC2로 시작한다.
  backGlobal.islocal= false;
    
    } else {
      ///로컬로 접속하면 관리자 계정임
    
      backGlobal.islocal = true;
      backGlobal.mylocaldeviceid="IF0001";
      backGlobal.ncount++;
 
      MainAPI.firebasedbtest();  

    
    }
    

    console.log("-------------------------backend start---------------------");
    console.log("islocalconnect : " + backGlobal.islocal +",farmscbeplatformversion : "+farmscubeplatformversion + " backGlobal.ncount : "+backGlobal.ncount);
    
    
 
const hostname = "127.0.0.1";
const port = 8877;



app.use("/api/farmrequest", function (req, res) {
  console.log("api farmrequest ..");
  MainAPI.postapi(req,res);
  });

  app.use("/api/devicerequest", function (req, res) {
    console.log("api devicerequest ..");
    MainAPI.postapifordevice(req,res);
    });

    
  
  /*

  app.get("/up", function (req, res) {
    console.log("post 7");
    console.log(req.url);
    MainAPI.postapi();
  
  
    //res.sendFile(path.join(__dirname, "/index1.html"));
  
  });
  
  
  

app.use("/api/update", function (req, res) {
  console.log("post up...........................11");
 
  
  MainAPI.postapi();

  res.send('update..');
});


*/



var server = app.listen(port, function () {
    console.log("Node server is running ver 77...");
    console.log('Hostname : ' + os.hostname());
  console.log('OS Type : ' + os.type());
  console.log('Platform : ' + os.platform());

  
    //  MainAPI.firebasedbtest();

  });

  