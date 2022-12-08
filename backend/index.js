//플랫폼 버전 백엔드 프론트엔드가 변경되면  업데이트 주석
const farmscubeplatformversion = 1.678;

var express = require("express");
var cors = require("cors");
const os = require("os");
var fileSystem = require("fs");
const path = require("path");

var app = express();

const devicesystemlog = require("./devicesystemlog");
var backGlobal = require("./backGlobal");

app.use(express.json());
app.use(cors());

const MainAPI = require("./testapi.js");
const DeviceMain = require("./devicemain.js");

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./backend/"));

console.log("-------------------------backend start---------------------");

backGlobal.platformversion = farmscubeplatformversion;
backGlobal.backmain = DeviceMain;

MainAPI.firebasedbinit();

var myhostname = os.hostname();
if (myhostname.indexOf("EC2-") != -1) {
  //AWS 사용할것이므로 서버 이름이 EC2로 시작한다. aws 서버에서 시작되면 무조건 서버용
  backGlobal.islocal = false;
  backGlobal.sessionmap = new Map();
} else {
  ///로컬로 접속하면 기본 장비 정보를 읽어와야함.

  backGlobal.islocal = true;
  backGlobal.systemlog = new devicesystemlog();
  backGlobal.mylocaldeviceid = backGlobal.backmain.deviceInit();
  backGlobal.ncount++;

  MainAPI.firebasedbsetup(backGlobal.mylocaldeviceid);
  //3초후 메인시작
  setTimeout(backGlobal.backmain.devicemaintask, 3000);
}

//서버에 요청
app.use("/api/farmrequest", function (req, res) {
  MainAPI.postapi(req, res);
});
// 장비로부터 데이터를 요청할때
app.use("/api/devicerequest", function (req, res) {
  MainAPI.postapifordevice(req, res);
});
// DB 관련 요청 서버, 장비
app.use("/api/dbrequest", function (req, res) {
  MainAPI.postapifordatabase(req, res);
});

var server = app.listen(8877, function () {
  console.log("Node server is running ...");
  console.log("Hostname : " + os.hostname() + ",Platform : " + os.platform());
});

console.log("islocalconnect : " + backGlobal.islocal + ",farmscbeplatformversion : " + backGlobal.platformversion + " backGlobal.ncount : " + backGlobal.ncount);
