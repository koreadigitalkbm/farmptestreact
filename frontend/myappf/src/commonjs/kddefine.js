
//일반 열거형, 상수등을 모아보자
module.exports = class KDDefine {

// 장비 모델명
  static PModelList = [
    'KPC200', // 식물재배기 1차 2차
    'KPC300', // 식물재배기 교육용 3차 
    'KPC480', // 식물재배기 연구용 3차
    'VFC3300', // 인도어팜
  ];

  

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
    ODT_RELAY: 0, // 단순접점
    ODT_PUMP: 1, //
    ODT_FAN: 2,
    ODT_VALVE: 3,
    ODT_LED: 4,
    ODT_COOLER: 5,
    ODT_HEATER: 6,
    ODT_POWER: 7,
    ODT_NOZZLE: 8,
    
    ODT_LED_WHITE: 30,
    ODT_LED_RED: 31,
    ODT_LED_BLUE: 32,
    ODT_LED_GREEN: 33,
    ODT_LED_IR: 34,
    ODT_LED_UVA: 35,
    ODT_LED_UVB: 36,



    ODT_ETC: 99,
    ODT_DELETE: 9999, //장치삭제
  });
  static HardwareTypeEnum = Object.freeze({
    HT_RELAY: 0, // 단순 on,off 제어 
    HT_SWITCH: 1, // 열기, 닫기 계페기
    HT_PWM: 2,   // PWM 제어 like LED
    HT_ETC: 10,   // 기타
  });
  
  //요청타입을 여기에 정의한다.
  static REQType = Object.freeze({
    RT_LOGIN: "login", //로그인
    RT_SYSTEMINIFO: "getsysteminfo", //장비 정보읽어옴
    RT_DEVICELOG: "getdevicelog", //장비 중요 로그를 읽어옴

    RT_GETVERSION: "getdeviceversion", //소프트웨어 버전 읽어옴
    RT_SWUPDATE: "setswupdate", // 장비 소프트웨어 업데이트

    RT_SYSTEMSTATUS: "getsystemstatus", // 장비 전체 상태
    RT_ACTUATOROPERATION: "setactuatoroperation", // 구동기 동작
    RT_ACTUATORSTATUS: "getactuatorstatus", // 구동기상태

    RT_SENSORSTATUS: "getsensors", // 센서상태

    RT_SETMYINFO: 'setmyinfo', //사용자 정보 수정
    RT_SETMYLOCALPW: 'setmypw',  // 로컬 접속 PW변경
    RT_GETAUTOCONTROLCONFIG: 'getautocontrol',  //자동제어 목록을 가져옴
    RT_SAVEAUTOCONTROLCONFIG: 'saveautocontrol', //자동제어 설정을 저장한다


    //클라우드 서버에 데이터 전송관련
    RT_SETDB_SENSOR: 'setdbsensor', // 센서데이터를 저장한다.
    RT_SETDB_EVENT: 'setdbevent', //  이벤트 데이터를 저장한다.
    RT_SETDB_CAMERA: 'setdbcamera', //  카메라 이미지데이터를 저장한다.
    
    
  });

  //자동제어 타입
  static AUTOType = Object.freeze({
    ACM_TIMER_ONLY_DAY: 0, // 주간시간만 타이머모드
    ACM_TIMER_DAY_NIGHT: 1,//주간야간모드
    
    ACM_SENSOR_ONLY_DAY: 10, // 주간시간만  센서모드
    ACM_SENSOR_DAY_NIGHT: 11,//주간야간모드
  
        
  });


    //자동제어 우선순위
    static AUTOPriority = Object.freeze({
      AP_LOW: 0, // 낮음
      AP_NORMAL: 1, //보통  
      AP_HIGH: 2,   //높음  
      AP_HIGHEST: 3, //최우선
      
    });

    
  //자동제어 분류
  static AUTOCategory = Object.freeze({
    ACT_HEATING: 0, // 난방
    ATC_COOLING: 1, // 냉방
    ATC_LED: 2, // 광량
    ATC_WATER: 3, // 관수
    ATC_AIR: 4, // 환기
    
    //식물재배기 고정
    ACT_HEAT_COOL_FOR_FJBOX: 100, // 냉난방  
    ACT_LED_MULTI_FOR_FJBOX: 101, // 3색LED  
    ACT_AIR_CO2_FOR_FJBOX: 102, // Co2 공급  
    
    
    ATC_USER: 999,// 사용자지정 
    
  });

  //자동제어 상태
  static AUTOStateType = Object.freeze({
    AST_Off: 0, // off
    AST_On: 1, // 켬
    AST_IDLE: 2, // 상태유지, 
    AST_ERROR: 3, // 에러상태 , 센서 연결끊김이나 노드 끊김 상태
    AST_Off_finish: 10, // 제어종료 장비를 off 하고 끝냄
    AST_Init: 20, // 초기화상태 상태가변경되어야 제어명령어를 줄수 있으므로 초기상태값지정
        
  });

  //센서조건
  static  SensorConditionType= Object.freeze({
    SCT_UP: "up", // >= 크면  on
    SCT_DOWN: "down", // <= 작으면  on
        
  });

//자동제어 상태
static EVENTType = Object.freeze({
  EVT_None: 0, //
  EVT_SYSTEM: 1,// 시스템 이벤트, 기동, 에러.
  EVT_ACTUATOR: 2, //  구동기 상태변화
  EVT_AUTOCONTROL: 3, // 자동제어 변경
      
});


};
