
//일반 열거형, 상수등을 모아보자
module.exports = class KDDefine {

  static ONOFFOperationTypeEnum = Object.freeze({
    OPT_On: 201, // 작동시작
    OPT_Off: 0, // 작동 멈춤
    OPT_Timed_On: 202, // 정해진 시간동안 작동
    OPT_Driectional_On: 203, // 정해긴 방향으로 정해진 시간동안 동작
  });

  static OPStatus = Object.freeze({
    OPS_Off: "off", //꺼짐
    OPS_On: "on", //켜짐
    OPS_Local: "local", //현장수동제어
    OPS_Idle: "idle",
  });

  static OutDeviceTypeEnum = Object.freeze({
    ODT_RELAY: 0,
    ODT_PUMP: 1, //
    ODT_FAN: 2,
    ODT_VALVE: 3,
    ODT_LED: 4,
    ODT_COOLER: 5,
    ODT_HEATER: 6,
    ODT_POWER: 7,
    ODT_NOZZLE: 8,
    ODT_ETC: 99,
    ODT_DELETE: 9999, //장치삭제
  });
  static HardwareTypeEnum = Object.freeze({
    HT_RELAY: 0, // 단순 on,off 제어 
    HT_SWITCH: 1, // 열기, 닫기 계페기
    HT_ETC: 2,   // 기타
  });
  
  //요청타입을 여기에 정의한다.
  static REQType = Object.freeze({
    RT_LOGIN: "login", //로그인
    RT_SYSTEMINIFO: "getsysteminfo", //장비 정보읽어옴
    RT_DEVICELOG: "getdevicelog", //장비 중요 로그를 읽어옴

    RT_GETVERSION: "getdeviceversion", //소프트웨어 버전 읽어옴
    RT_SWUPDATE: "setswupdate", // 장비 소프트웨어 업데이트

    RT_SYSTEMSTATUS: "getsystemstatus", // 장비 전체 상태
    RT_ACTUATOROP: "setactuatoroperation", // 구동기 동작
    RT_ACTUATORSTATUS: "getactuatorstatus", // 구동기상태

    RT_SENSORSTATUS: "getsensors", // 센서상태

    RT_SETMYINFO: 'setmyinfo' //사용자 정보 수정
    
  });

  //자동제어 분류
  static AUTOCategory = Object.freeze({
    ACT_HEATING: 0, // 난방
    ATC_COOLING: 1, // 냉방
    ATC_LED: 2, // 광량
    ATC_WATER: 3, // 관수
    ATC_AIR: 4, // 환기
    
    ACT_HEAT_COOL: 100, // 냉난방  식물재배기
    ACT_LED_MULTI: 101, // 3색LED  식물재배기
    ACT_AIR_CO2: 102, // Co2 공급  식물재배기
    
    ATC_USER: 999,// 사용자지정 
    
  });


};
