//일반 열거형, 상수등을 모아보자
module.exports = class KDDefine {
  static KDSensorTypeEnum = Object.freeze({
    SUT_None: 0,
    SUT_Temperature: 1, //공기온도
    SUT_Humidity: 2,
    SUT_SoilTemperature: 3,
    SUT_SoilMoisture: 4,
    SUT_SoilEC: 5,
    SUT_CO2: 6,
    SUT_WTemperature: 7, ///배지온도
    SUT_SoraRadiation: 8,
    SUT_WINDSPEED: 9,
    SUT_WINDVANE: 10,
    SUT_BAROMETER: 11,
    SUT_PRESSURE: 12,
    SUT_RAINGUAGE: 13,
    SUT_RAINDETECTOR: 14,
    SUT_UV: 15,

    SUT_PE300_PH: 16, ///
    SUT_PE300_EC: 17,
    SUT_PE300_TEMP: 18,

    SUT_CO1: 19, //Co  센서
    SUT_O2: 20, //산소 센서

    SUT_LIGHT: 21, //SMBL 조도 센서

    SUT_COLOR_RED: 22, //SMBL 컬러센서 Red   n 0~100000
    SUT_COLOR_GREEN: 23, //SMBL 컬러센서 Green  n  0~100000
    SUT_COLOR_BLUE: 24, //SMBL 컬러센서 Blue  n 0~100000

    SUT_AMMONIA: 25, //암모니아 센서 ppm  0~1000
    SUT_FLOWMETER: 26, //유량계  L/min    0.01~1000.00
    SUT_FLOWMETER_TOTAL: 27, //적산 유량계  L    0.1~10000.0

    SUT_BATTRY: 28, //베터리 레벨  Battery %   0~100 %
    SUT_WEIGHT_KG: 29, //무게  Weght kg   0.001 소수점 3자리
    SUT_WATER_MM: 30, //수위      mm  1~10000mm

    SUT_DO_MG: 31, //용존산소량  ( DO)    0~20 mg/L  소수점 2자리

    SUT_SoilBulkEC: 32, // 토양 벌크 EC
    SUT_Counter: 33, //  단순계수기

    SUT_H2S: 34, //  황화수소
    SUT_PM25: 35, //  초미세먼지
    SUT_PM10: 36, //  미세먼지
    SUT_C1H4: 37, //  매탄
    SUT_C2H6: 38, //  에탄
    SUT_C3H6: 39, // 프로판
    SUT_SOLARMJ: 40, // MJ/m2    누적일사량    메가 줄  소수점 3자리
    SUT_DEWPOINT: 41, // ℃   이슬점     소스점 1자리
    //20210809
    SUT_FIRE_DETECTOR: 42, // 0 , 1  화재감지기 식물재배기에서는 수위감지로 표시
    SUT_HUMIDITY_DEFICIT: 43, // 0 , 1  수분부족분   0~100  g/m3 소수점 1자리

    //20220712
    SUT_DIFF_PRESSURE: 44, //  차압 (Differential pressure)0~1000 Pa 소수점 1자리
    SUT_QUANTUM_MOL: 45, //  광양자(Quantum) 0~2000 Mol 소수점 1자리

    SUT_SALINITY: 46, // 염도센서(Salinity) 0~50 ppt  소수점 1자리

    SUT_TENSIOMETER_KPA:  47, //토양장력센서(tensiometer) kPa  -100~0   소수점 0자리
	//20240122
	SUT_SOIL_NITROGEN : 48, //토양 질소 mg/kg 소수점 0자리   Nitrogen
	SUT_SOIL_PHOSPHORUS: 49, //토양 인 mg/kg 소수점 0자리 Phosphorus
	SUT_SOIL_POTASSIUM : 50, //토양 칼륨 mg/kg 소수점 0자리 Potassium
	SUT_SOIL_PH : 51, //토양 pH  0~15 소수점 1자리   Soil pH

	//20250124
	SUT_WATER_DCO2: 52, // 용존 co2   0~2000ppm 소수점 0자리  Dissolved CO2
	SUT_WATER_NO2 : 53, //  아질산염 NO2   0~40000ppm 소수점 2자리  Nitrite Ion(NO2)
	SUT_WATER_NO3 : 54, // 질산염 NO3   0~62000ppm 소수점 2자리  Nitrite Ion(NO3)


  });

  // 장비 모델명
  static PModel = Object.freeze({
    KPC200: "KPC200", // 식물재배기 1차 2차
    KPC300: "KPC300", // 식물재배기  3차(교육용)
    KPC480: "KPC480", // 식물재배기  3차(연구용)
    VFC3300: "VFC3300", // 인도어팜
    KPC880A: "KPC880-SMALL", // 통합보드 실습용 작은크기
    KPC880B: "KPC880-MEDIUM", // 통합보드 교육용 중간크기
    KPC880C: "KPC880-LARGE", // 통합보드 연구용 큰거
    KPC880D: "KPC880-HOUSE", // 통합보드 미니온실
    KPC880E: "KPC880-DISPLAY", // 통합보드 윈도우형 2단재배기 디스플레이용
    KPC880NB: "KPC880-MID-NUTRIENT", // 통합보드 교육용 중간크기, 양액기 추가, 온도 단순제어 
    KPC880TB: "KPC880-MID-WATERTANK", // 통합보드 교육용 중간크기, 수조형 리무재배기

    
  });

  static PModelList = [KDDefine.PModel.KPC200, KDDefine.PModel.KPC300, KDDefine.PModel.KPC480, KDDefine.PModel.VFC3300,KDDefine.PModel.KPC880A,KDDefine.PModel.KPC880B,KDDefine.PModel.KPC880NB,KDDefine.PModel.KPC880TB,KDDefine.PModel.KPC880C,KDDefine.PModel.KPC880D,KDDefine.PModel.KPC880E];

  static ONOFFOperationTypeEnum = Object.freeze({
    OPT_On: 201, // 작동시작
    OPT_Off: 0, // 작동 멈춤
    OPT_Timed_On: 202, // 정해진 시간동안 작동
    OPT_Driectional_On: 203, // 정해긴 방향으로 정해진 시간동안 동작
    OPT_Timed_On_Open:  301, // 정해진 시간동안 열림 작동
    OPT_Timed_On_Close: 302, // 정해진 시간동안   닫힘작동
    OPT_Stop: 303,
  
    OPT_Camera_TakeSave: 1909, // 카메라촬영 및 저장 이값으로 지정
  });

  static OPStatus = Object.freeze({
    OPS_Off: "off", //꺼짐
    OPS_On: "on", //켜짐
    OPS_Local: "local", //현장수동제어
    OPS_Idle: "idle",
  });

  //구동기 자동수동
  static OPMode = Object.freeze({
    OPM_Manual: "ma", //수동
    OPM_Auto: "at", //자동
    OPM_Local: "lc", //현장수동
  });

  static OutDeviceTypeEnum = Object.freeze({
    ODT_RELAY: 0, // 단순접점
    ODT_PUMP: 1, //
    ODT_FAN: 2,  //내부 유동팬
    ODT_VALVE: 3,
    ODT_LED: 4,
    ODT_COOLER: 5,
    ODT_HEATER: 6,
    ODT_POWER: 7,
    ODT_NOZZLE: 8,
    ODT_TEMP_CONTOLLER: 9,
    ODT_HUMIDIFLER: 10,
    ODT_AG_PUMP: 11, //교반용 펌프
    ODT_TEMP_CIRCULARFAN: 12, //냉난방기용 공기순환팬
    ODT_TEMP_CHILLER: 13, // 냉각수 칠러

    ODT_LED_WHITE: 30,
    ODT_LED_RED: 31,
    ODT_LED_BLUE: 32,
    ODT_LED_GREEN: 33,
    ODT_LED_IR: 34,
    ODT_LED_UVA: 35,
    ODT_LED_UVB: 36,

    ODT_SOL_A: 40, //양액제어용 솔밸브
    ODT_SOL_B: 41,
    ODT_SOL_C: 42,
    ODT_SOL_D: 43,
    ODT_SOL_E: 44,

    ODT_WINDOW: 45, //측창 윈도우
    ODT_SCREEN: 46, // 보온 덥개 스크린
    ODT_FLOWFAN: 47, //외부환기팬
    

    ODT_VALVE_IN_INNER: 50, //물탱크 솔밸브 입력  내부 물통
    ODT_VALVE_IN_EXTERN: 51, //물탱크 솔밸브 입력  외부 급수
    ODT_VALVE_OUT_INNER: 52, //물탱크 솔밸브 출력  내부 물통
    ODT_VALVE_OUT_EXTERN: 53, //물탱크 솔밸브 출력  외부 배수


    ODT_ETC: 99,
    ODT_DELETE: 9999, //장치삭제
  });
  static HardwareTypeEnum = Object.freeze({
    HT_RELAY: 0, // 단순 on,off 제어
    HT_SWITCH: 1, // 열기, 닫기 계페기
    HT_PWM: 2, // PWM 제어 like LED
    HT_PID: 3, // PID 제어 컴프레셔 온도제어용
    HT_ETC: 10, // 기타
  });

  //요청타입을 여기에 정의한다.
  static REQType = Object.freeze({
    RT_LOGIN: "login", //로그인
    RT_SYSTEMINIFO: "getsysteminfo", //장비 정보읽어옴
    RT_DEVICELOG: "getdevicelog", //장비 중요 로그를 읽어옴

    RT_GETVERSION: "getdeviceversion", //소프트웨어 버전 읽어옴
    RT_SWUPDATE: "setswupdate", // 장비 소프트웨어 업데이트

    RT_SHELLCMD: "admincommand", // 장비 쉘명령어 직접

    RT_SYSTEMSTATUS: "getsystemstatus", // 장비 전체 상태
    RT_ACTUATOROPERATION: "setactuatoroperation", // 구동기 동작
    RT_ACTUATORSTATUS: "getactuatorstatus", // 구동기상태

    RT_SENSORSTATUS: "getsensors", // 센서상태

    RT_SETMYINFO: "setmyinfo", //사용자 정보 수정
    RT_SETMYLOCALPW: "setmypw", // 로컬 접속 PW변경
    RT_GETAUTOCONTROLCONFIG: "getautocontrol", //자동제어 목록을 가져옴
    RT_SAVEAUTOCONTROLCONFIG: "saveautocontrol", //자동제어 설정을 저장한다
    RT_RESETAUTOCONTROLCONFIG: "resetautocontrol", //자동제어 설정을 리셋하고 초기값으로 되돌린다.
    RT_SETALIAS: "setalias", //별칭정보 저장

    //클라우드 서버에 데이터 전송관련
    RT_SETDB_SENSOR: "setdbsensor", // 센서데이터를 저장한다.
    RT_SETDB_EVENT: "setdbevent", //  이벤트 데이터를 저장한다.
    RT_SETDB_CAMERA: "setdbcamera", //  카메라 이미지데이터를 저장한다.

    RT_GETDB_DATAS: "getdbdatas", //  DB 에서 데이터를 검색해서 보내준다.

    RT_SETDB_LOGINPW: "setloginpw", //  로그인 암호를 변경한다.
  });

  //자동제어 타입
  static AUTOType = Object.freeze({
    ACM_TIMER_ONLY_DAY: 0, // 주간시간만 타이머모드
    ACM_TIMER_DAY_NIGHT: 1, //주간야간모드

    ACM_SENSOR_ONLY_DAY: 10, // 주간시간만  센서모드
    ACM_SENSOR_DAY_NIGHT: 11, //주간야간모드
    
  });

  //자동제어 우선순위
  static AUTOPriority = Object.freeze({
    AP_LOW: 0, // 낮음
    AP_NORMAL: 1, //보통
    AP_HIGH: 2, //높음
    AP_HIGHEST: 3, //최우선
  });

  //자동제어 분류
  static AUTOCategory = Object.freeze({
    ACT_HEATING: 0, // 난방
    ATC_COOLING: 1, // 냉방
    ATC_LED_ONOFF: 2, // 광량 단순제어 
    ATC_WATER: 3, // 관수
    ATC_AIR: 4, // 환기

    //식물재배기 고정
    ACT_HEAT_COOL_FOR_FJBOX: 100, // 냉난방
    ACT_LED_MULTI_FOR_FJBOX: 101, // 3색LED
    ACT_AIR_CO2_FOR_FJBOX: 102, // Co2 공급
    ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX: 103, // 환기제어, co2, 습도센서 사용
    ACT_HEATER_HUMIDITY_FOR_FJBOX: 104, // 습도제어,  습도센서 사용
    ACT_NUTRIENT_SOL3_FOR_FJBOX: 105, // 양액제어, 3개 솔밸브 사용
    ACT_PID_TEMP_CONTROL_FOR_FJBOX: 106, // 냉난방 PID제어 
    ACT_PID_HEATER_HUMIDITY_FOR_FJBOX: 107, // 습도제어, PID제어 

    ACT_SCREEN_FOR_MINIHOUSE: 108, // 보온덥개
    ACT_WINDOW_FOR_MINIHOUSE: 109, // 측창제어
    ACT_AIR_VENT_CO2_HUMIDITY_FOR_MINIHOUSE: 110, // 환기제어, co2, 습도센서 사용
    ACT_HEATER_HUMIDITY_FOR_MINIHOUSE: 111, //습도 제어
    ACT_AIR_CIRU_TIMER_FOR_MINIHOUSE: 112, //내부 순환팬 제어 타이머

    ACT_CHILLER_TEMP_CONTROL_FOR_WATERTANK: 120, // 냉각기 온도제어 KFC880TB
    ACT_PARTIAL_WATER_CHANGE_FOR_WATERTANK: 121, // 물탱크 환수



    ACT_CAMERA_FJBOX: 199, // 사진촬영  자동제어로직을 사용하자

    ATC_USER: 999, // 사용자지정
  });

  //자동제어 상태
  static AUTOStateType = Object.freeze({
    // 자동제어상태는 만단위로 시작 다른 상태와 구별하기 위해
    AST_Off: 10000, // off
    AST_On: 10001, // 켬
    AST_IDLE: 10002, // 상태유지,
    AST_ERROR: 10003, // 에러상태 , 센서 연결끊김이나 노드 끊김 상태
    AST_Down_Idle: 10004, // 냉난방 동시제어경우  설정온도에 도달하면 냉난방이 모두 꺼져야함으로 상태를 한게더 만듬.
    AST_Up_Idle: 10005, // 냉난방 동시제어경우  설정온도에 도달하면 냉난방이 모두 꺼져야함으로 상태를 한게더 만듬.
    AST_Open: 10006, // 개폐기 열림상태
    AST_Close: 10007, // 개폐기 닫힘상태
    AST_Stop: 10008, // 개폐기 닫힘상태

    
    AST_Off_finish: 10010, // 제어종료 장비를 off 하고 끝냄
    AST_Init: 10020, // 초기화상태 상태가변경되어야 제어명령어를 줄수 있으므로 초기상태값지정

    AST_Drain_water: 10030, // 배수중
    AST_Pupmping_water: 10031, // 급수중

    AST_AutoToMa: 20011, //자동제어에서 수동제어 변경
    AST_MaToAuto: 20022, //수동제어에서 자동제어 변경
    AST_AutoChange: 20023, //자동제어 설정이 변경됨
  });

  //센서조건
  static SensorConditionType = Object.freeze({
    SCT_UP: "up", // >= 크면  on
    SCT_DOWN: "down", // <= 작으면  on
    SCT_DOWNBOTHIDLE: "both", // <= 온도 냉난방제어시 사용 작으면  true 설정값에 근접하면 장비 off 상태유지되도록
  });

  //자동제어 상태
  static EVENTType = Object.freeze({
    EVT_None: 0, //
    EVT_SYSTEM: 1, // 시스템 이벤트, 기동, 에러.
    EVT_ACTUATOR: 2, //  구동기 상태변화
    EVT_AUTOCONTROL: 3, // 자동제어 변경, 상태변화
  });

  //카메라 타입
  static CameraType = Object.freeze({
    CT_RGB: "RGBCamera", // RGB 컬러카메라
    CT_USB: "USBCamera", // USB 타입 RGB 컬러카메라
    CT_DEPTH: "DEPTHCamera", // 데스카메라
    CT_IR: "IRCamera",
    CT_MANUAL: "manualcapture",
  });

  //구동기 이름  id  다국어지원  언어셋 ID만들때 사용 " LT_ACTDEVICE_36" 뒷번호 확인
  static ActuatorNameID = Object.freeze({
    NID_ACTUATOR: 0, // actuator
    NID_HEATER: 1, // 히터
    NID_COOLER: 2, // 쿨러
    NID_PUMP: 3, // 펌프
    NID_FAN: 4, // 팬
    NID_AIRFAN: 5, //외부환기팬
    NID_VALVE: 6, // 밸브
    NID_AIRVALVE: 7, // 환기밸브
    NID_WATERPUMP: 8, // 관수펌프
    NID_FLOWFAN: 9, //내부 유동팬
    NID_SOLVALVE: 10, // 솔밸브
    NID_TEMP_CONTROLER: 11, //냉난방 온도 제어기
    NID_TEMP_CIRCULARFAN: 12, //냉난방용 순환팬
    NID_TEMP_CHILLER: 13, //냉각수 칠러
    NID_VALVE_INLET_INTERNAL: 14, // 내부입력밸브
    NID_VALVE_INLET_EXTERNAL: 15, // 외부입력밸브
    NID_VALVE_OUTLET_INTERNAL: 16, // 내부입력밸브
    NID_VALVE_OUTLET_EXTERNAL: 17, // 외부입력밸브


    NID_LED: 20, //LED
    NID_LEDWHITE: 21, // 흰색 LED
    NID_LEDRED: 22, // 적색 LED
    NID_LEDBLUE: 23, // 청색 LED
    NID_LEDGREEN: 24, // 녹색 LED

    NID_ECVALVEA: 30, // A액밸브(EC)
    NID_ECVALVEB: 31, // B액밸브(EC)
    NID_ECVALVEC: 32, // C액밸브(EC)
    NID_ECVALVED: 33, // D액밸브(EC)
    NID_ECVALVEE: 34, // E액밸브(EC)

    NID_ECVALVEA_PH: 35, // A액밸브(산)
    NID_ECVALVEB_PH: 36, // B액밸브(산)
    NID_ECVALVEC_PH: 37, // C액밸브(산)
    NID_ECVALVED_PH: 38, // D액밸브(산)
    NID_ECVALVEE_PH: 39, // E액밸브(산)

    NID_HUMI_HEATER: 40, // 가습기
    NID_CO2_VALVE: 41, // co2 공급밸브
    NID_HUMIDIFIER_PUMP: 42, // 가습기 히터 물 펌프
    NID_AGITATOR_PUMP: 43, // 가습기 히터 물 펌프

    NID_LEFT1_WINDOW: 44, // 왼쪽 측창
    NID_RIGHT1_WINDOW: 45, // 오른쪽 측창
    NID_COVER_SCREEN: 46, // 보온 덥개 

  });

  //시스템 이벤트 코드
  static SysEventCode = Object.freeze({
    SEC_None: 0, // 시스템 이벤트
    SEC_Bootup: 1, //시스템 시작되었습니다.
    SEC_Error: 2, //시스템 장애가 발생하였습니다.
    SEC_Sensor_error: 3, //센서연결이 끊겼습니다.. param1:  센서 이름 ,param2:  센서 ID
    SEC_Message: 10, //p1: 그냥 메시지 디버깅용으로 중요 정보를 그냥 텍스트로 표시한다.
  });
};
