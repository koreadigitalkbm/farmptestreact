//플랫폼 버전 백엔드 프론트엔드가 변경되면  업데이트 주석
const farmscubeplatformversion = 1.764;

var express = require("express");
var cors = require("cors");
const os = require("os");

const LocalMain = require("./localonly/localmain");
const ServerMain = require("./serveronly/servermain");

console.log("-------------------------backend start---------------------");

let mMainclass;

var myhostname = os.hostname();
if (myhostname.indexOf("EC2AMAZ") != -1) {
  //서버사이드 시작
  //AWS 사용할것이므로 서버 이름이 EC2로 시작한다. aws 서버에서 시작되면 무조건 서버용
  mMainclass = new ServerMain(farmscubeplatformversion);
} else {
  //로컬 장비 사이드 시작
  ///로컬로 접속하면 기본 장비 정보를 읽어와야함.
  mMainclass = new LocalMain(farmscubeplatformversion);
}

mMainclass.mAPI.firebasedbsetup();



const app = express();

app.use(cors());
app.use(express.static("./backend/"));

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));



//서버에 요청
app.use("/api/farmrequest", function (req, res) {
  mMainclass.mAPI.postapi(req, res);
});
// 장비로부터 데이터를 요청할때
app.use("/api/devicerequest", function (req, res) {
  mMainclass.mAPI.postapifordevice(req, res);
});
// DB 관련 요청 서버, 장비
app.use("/api/dbrequest", function (req, res) {
  mMainclass.mAPI.postapifordatabase(req, res);
});

var server = app.listen(8877, function () {
  console.log("Node server is running ...");
  console.log("Hostname : " + os.hostname() + ",Platform : " + os.platform());
});


console.log("islocalconnect : " + mMainclass + ",farmscbeplatformversion : " + farmscubeplatformversion );

