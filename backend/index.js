//플랫폼 버전 백엔드 프론트엔드가 변경되면  업데이트 주석
//버전업 로그 1.801 장비 별칭기능 추가 파일새로 생성됨.
//1.814 : KPC480 연구용장비 기능업데이트
//1.815 : 카메라 촬영 버그 수정
//1.816 : 자동제어 Number() 적용
//1.817 : 프론트엔드  UI 개선
//2.101 : 프로그램 업데이트기능 추가  1자리수 변경시 백엔드 npm install 실행,  소수점 첫번째 자리 숫자 변경시  frontend  install 실행, 
//2.201 : 데이터차트 엑셀파일로 저장기능추가, 프론트엔드 패키지 설치필요.
//2.213 : 서버 통신 방식을 변경함. 요청메시지만 파이어베이스사용 응답은 서버로 직접보냄
const farmscubeplatformversion = 2.213;

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

// 파이어베이스 요청에 대한 디바이스 응답 
app.use("/api/firebasersp", function (req, res) {
  mMainclass.mAPI.postapiforfirebase(req, res);
});




var server = app.listen(8877, function () {
  console.log("Node server is running ...");
  console.log("Hostname : " + os.hostname() + ",Platform : " + os.platform());
});


console.log("islocalconnect : " + mMainclass + ",farmscbeplatformversion : " + farmscubeplatformversion );
/*
setInterval( async () => {
  console.log( 'current version is : ', farmscubeplatformversion)

  hosts.forEach( async function (host) {
    await ping.promise.probe(host)
        .then(function (res) {
            console.log(res);
        });
  });
}, 5000 );
*/