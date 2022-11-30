//플랫폼 버전 백엔드 프론트엔드가 변경되면  업데이트 주석
const farmscubeplatformversion = 1.478;

var express = require("express");
var cors = require("cors");
const os = require("os");
var fileSystem = require("fs");
const path = require("path");

var app = express();

var backGlobal = require("./backGlobal");

app.use(express.json());
app.use(cors());

const MainAPI = require("./testapi.js");



//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./backend/"));

var myhostname = os.hostname();

MainAPI.firebasedbinit();

backGlobal.platformversion = farmscubeplatformversion;

if (myhostname.indexOf("EC2-") != -1) {
  //AWS 사용할것이므로 서버 이름이 EC2로 시작한다. aws 서버에서 시작되면 무조건 서버용
  backGlobal.islocal = false;
} else {
  ///로컬로 접속하면 기본 장비 정보를 읽어와야함.

  backGlobal.islocal = true;
  backGlobal.mylocaldeviceid = "IF0001";
  backGlobal.ncount++;

  MainAPI.firebasedbsetup(backGlobal.mylocaldeviceid);
}

console.log("-------------------------backend start---------------------");
console.log("islocalconnect : " + backGlobal.islocal + ",farmscbeplatformversion : " + backGlobal.platformversion + " backGlobal.ncount : " + backGlobal.ncount);


app.use("/api/farmrequest", function (req, res) {
  MainAPI.postapi(req, res);
});

app.use("/api/devicerequest", function (req, res) {
  MainAPI.postapifordevice(req, res);
});



var server = app.listen(8877, function () {
  console.log("Node server is running ...");
  console.log("Hostname : " + os.hostname() + ",Platform : " + os.platform());
  
});
