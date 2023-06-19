//플랫폼 버전 백엔드 프론트엔드가 변경되면  업데이트 주석
//버전업 로그 1.801 장비 별칭기능 추가 파일새로 생성됨.
//1.814 : KPC480 연구용장비 기능업데이트
//1.815 : 카메라 촬영 버그 수정
//1.816 : 자동제어 Number() 적용
//1.817 : 프론트엔드  UI 개선
//2.101 : 프로그램 업데이트기능 추가  1자리수 변경시 백엔드 npm install 실행,  소수점 첫번째 자리 숫자 변경시  frontend  install 실행,
//2.201 : 데이터차트 엑셀파일로 저장기능추가, 프론트엔드 패키지 설치필요.
//2.213 : 서버 통신 방식을 변경함. 요청메시지만 파이어베이스사용 응답은 서버로 직접보냄
//2.214 : 서버 통신 응답시 해당 요청타입에 맞게 응답되도록 수정.
//2.215 : 화와이 최종출시 버전
//2.216 : KPC480 식물재배기 연구용 1차 설정
//2.217 : 쉘명령어 원격에서 실행할수 있도록 수정
//2.218 : KPC480 습도제어 관련 버그 수정
//2.219 : 통신관련 api 예외처리 자동제어 버그 수정
//2.221 : 백엔드 로그 추가 자꾸 디짐..
//2.222 : PID 자동제어 로직 추가
//2.223 : KPC480 장비 펌웨어 연동 코드 추가 버전이 반드시 20233030이후 
//2.224 : 통신API, KPC480 습도제어 버그수정
//2.225 : PID 제어 빠르게 수정 
//2.227 : UI 최적화, 습도 PID 제어기능 추가, 농수산대학 납품 버전
//2.228 : KPC300 장비 코드 추가
//2.229 : KPC480 장비 포트변경 펌웨어 수정
const farmscubeplatformversion = 2.229;

const express = require("express");
const cors = require("cors");
const app = express();
const os = require("os");
const myhostname = os.hostname();
const LocalMain = require("./localonly/localmain");
const ServerMain = require("./serveronly/servermain");

let mMainclass;

app.use(cors());
app.use(express.static("./backend/"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

console.log("-------------------------backend start---------------------");

if (myhostname.indexOf("EC2AMAZ") != -1) {
  //서버사이드 시작
  //AWS 사용할것이므로 서버 이름이 EC2로 시작한다. aws 서버에서 시작되면 무조건 서버용
  mMainclass = new ServerMain(farmscubeplatformversion);
} else {
  //로컬 장비 사이드 시작
  ///로컬로 접속하면 기본 장비 정보를 읽어와야함.
  mMainclass = new LocalMain(farmscubeplatformversion);
}

try {
  mMainclass.Inititalize();
} catch (error) {
  mMainclass.systemlog.memlog(" index  catch error : " + error.toString());
}

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

mMainclass.systemlog.memlog("farmscbeplatformversion : " + farmscubeplatformversion);
