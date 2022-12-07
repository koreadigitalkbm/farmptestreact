
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
  

};
