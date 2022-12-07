//전역변수들 모음

var backGlobal = {
    platformversion:0, //플랫폼 버전 
    fbdatabase :undefined, //파이어베이스 db
    fblocalresponse :undefined, //파이어베이스 응답
    fblocalrequst :undefined, //파이어베이스 응답
    islogin : false, // 
    islocal: false,  // 로컬, 원격
    connecteddeviceid: undefined, // 연결된 장비고유ID
    mylocaldeviceid: "IF0000", // 로컬 장비 시제번호 6자리 문자열 고정
    localpassword: "1234", //장비 접속기본암호
    systemlog :undefined, //장비로그기록용
    sensorinterface :undefined, // 센서관련 인터페이스
    actuatorinterface :undefined, //구동기 관련 인터페이스
    localsysteminformations:undefined, // 장비설정 및 구동기정보, 기타 관련 정보 집합

    ncount:0
  }
  
  module.exports = backGlobal;


