/// 자동제어 관련 API 모음
const AutoControlconfig = require("./autocontrolconfig");
const KDDefine = require("./kddefine");

module.exports = class AutoControlUtil {

  //PWM 방식으로 동작할때 주기 분으로 계산
  static Getintervaltimeminute(OnTime,OffTime )
  {
    let minute= (OnTime/60.0 + OffTime/60.0);
    return Math.ceil(minute);
  }

  static GetActuatorbyUid(mActList, mUid) {
    for (const ma of mActList) {
      if (ma.UniqID == mUid) {
        return ma;
      }
    }

    console.log(" GetActuatorbyUid null= "+mUid);
    
    return null;
  }

  static IsIncludeTime(mstarttime, mendtime, mcurrenttime) {
    //시작시간이 더크면 자정포함임.
    let starttime = Number(mstarttime);
    let endtime = Number(mendtime);
    let currenttime = Number(mcurrenttime);

    if (starttime > endtime) {
      if (currenttime >= starttime || currenttime <= endtime) {
        return true;
      }
    } else {
      if (currenttime >= starttime && currenttime <= endtime) {
        return true;
      }
    }
  }
  static CreateDefaultAlias(modelname) {
    let itemlist = [];

    if ( modelname === "KPC200") {
      const ext_temp={
        id:'S01C06T01',
        name:'Ext Temperature'};  //외부온도

      const ext_humi={
        id:'S01C06T02',
        name:'Ext Humidity' };      //외부 습도

    

      itemlist.push(ext_temp);
      itemlist.push(ext_humi);
    
    }
    else
    {
      //디폴트로 1개는 더미로 생성 
      const itmem1={
        id:'dummyid',
        name:'dummyname'};  
        itemlist.push(itmem1);
    }

    return itemlist;
  }

  static CreateDefaultConfig(modelname) {
    let mcfglist = [];

    //모델별로 디폴트 자동제어 설정

    if ( modelname === "KPC200") {

      //내부온습도 4번 채널, 5번 co2, 6번 외부온습도, 0번 EC, 1번 pH
      //////////////////////////온도제어
      let m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_TEMP";
      m1.Name = "온도제어(냉난방)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
      m1.Cat = KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX; //  자동제어 분류
      m1.Actlist.push("N01C00T00"); ///히터 릴레이 장비
      m1.Actlist.push("N01C01T00"); ///쿨러 릴레이 장비
      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C04T01"); /// 온도센서 지정
      m1.DTValue = 24.0;
      m1.NTValue = 20.0;
      m1.BValue = 1;
      m1.Cdir = KDDefine.SensorConditionType.SCT_DOWNBOTHIDLE;
      mcfglist.push(m1);

      //////////////////관수제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_WATER";
      m1.Name = "관수제어(타이머)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_TIMER_DAY_NIGHT;
      m1.Cat = KDDefine.AUTOCategory.ATC_WATER; //  자동제어 분류
      m1.Actlist.push("N01C04T00"); ///관수 릴레이 장비
      m1.DOnTime = 60;
      m1.DOffTime = 1800;
      m1.NOnTime = 30;
      m1.NOffTime = 1800;
      m1.STime = 8 * 3600;
      m1.ETime = 20 * 3600;
      m1.TValue = 0;
      m1.BValue = 0;
      m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
      mcfglist.push(m1);

      ///LED 제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_LED";
      m1.Name = "광량제어(3LED)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_TIMER_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ACT_LED_MULTI_FOR_FJBOX; //  자동제어 분류
      m1.Actlist.push("N01C24T02"); ///
      m1.Actlist.push("N01C25T02"); ///
      m1.Actlist.push("N01C26T02"); ///
      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.NOnTime = 0;
      m1.NOffTime = 0;
      m1.STime = 8 * 3600;
      m1.ETime = 15 * 3600 + 1200;
      m1.DTValue = 0;
      m1.BValue = 0;
      m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
      m1.Params.push(25);
      m1.Params.push(15);
      m1.Params.push(50);
      mcfglist.push(m1);
      
      ///환기 제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_AIR";
      m1.Name = "환기제어(CO2,습도)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX; //  자동제어 분류
      m1.Actlist.push("N01C06T00"); ///환기팬, 환기밸브  장비가 여려개이면 장비종류로 구별하자
      m1.DOnTime = 3600;
      m1.DOffTime = 3600;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C04T02"); /// 습도센서 지정
      m1.Senlist.push("S01C05T06"); /// Co2센서 지정  센서가 업더라도 지정꼭해야함
      m1.DTValue = 85.0; // 습도값
      m1.NTValue = 350.0; // co2 값
      m1.BValue = 1;
      m1.Cdir = KDDefine.SensorConditionType.SCT_UP;
      mcfglist.push(m1);



    }


     if (modelname === "KPC480" ) {
     //////////////////////////온도제어
     let m1 = new AutoControlconfig();
     m1.Lid = "LT_ANAME_TEMP";
     m1.Name = "온도제어(냉난방)";
     m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
     m1.Enb = false;
     m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
     m1.Cat = KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX; //  자동제어 분류
     m1.Actlist.push("N01C00T00"); ///히터 릴레이 장비
     m1.Actlist.push("N01C01T00"); ///쿨러 릴레이 장비
     m1.DOnTime = AutoControlconfig.OnTimesecMAX;
     m1.DOffTime = 0;
     m1.STime = 8 * 3600;
     m1.ETime = 18 * 3600;
     m1.Senlist.push("S01C02T01"); /// 온도센서 지정
     m1.DTValue = 24.0;
     m1.NTValue = 20.0;
     m1.BValue = 1;
     m1.Cdir = KDDefine.SensorConditionType.SCT_DOWNBOTHIDLE;
     mcfglist.push(m1);

     //////////////////관수제어
     m1 = new AutoControlconfig();
     m1.Lid = "LT_ANAME_WATER";
     m1.Name = "관수제어(타이머)";
     m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
     m1.Enb = false;
     m1.AType = KDDefine.AUTOType.ACM_TIMER_DAY_NIGHT;
     m1.Cat = KDDefine.AUTOCategory.ATC_WATER; //  자동제어 분류
     m1.Actlist.push("N01C15T00"); ///관수 릴레이 장비
     m1.DOnTime = 30;
     m1.DOffTime = 120;
     m1.NOnTime = 10;
     m1.NOffTime = 120;
     m1.STime = 8 * 3600;
     m1.ETime = 20 * 3600;
     m1.TValue = 0;
     m1.BValue = 0;
     m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
     mcfglist.push(m1);

     ///LED 제어
     m1 = new AutoControlconfig();
     m1.Lid = "LT_ANAME_LED";
     m1.Name = "광량제어(3LED)";
     m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
     m1.Enb = false;
     m1.AType = KDDefine.AUTOType.ACM_TIMER_ONLY_DAY;
     m1.Cat = KDDefine.AUTOCategory.ACT_LED_MULTI_FOR_FJBOX; //  자동제어 분류
     m1.Actlist.push("N01C24T02"); ///
     m1.Actlist.push("N01C25T02"); ///
     m1.Actlist.push("N01C26T02"); ///
     m1.DOnTime = AutoControlconfig.OnTimesecMAX;
     m1.DOffTime = 0;
     m1.NOnTime = 0;
     m1.NOffTime = 0;
     m1.STime = 8 * 3600;
     m1.ETime = 15 * 3600 + 1200;
     m1.DTValue = 0;
     m1.BValue = 0;
     m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
     m1.Params.push(25);
     m1.Params.push(15);
     m1.Params.push(50);
     mcfglist.push(m1);
     
     ///환기 제어 습도를 낮춤
     m1 = new AutoControlconfig();
     m1.Lid = "LT_ANAME_AIR";
     m1.Name = "환기제어(CO2,습도)";
     m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
     m1.Enb = false;
     m1.AType = KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY;
     m1.Cat = KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX; //  자동제어 분류
     m1.Actlist.push("N01C06T00"); ///환기팬, 환기밸브  장비가 여려개이면 장비종류로 구별하자
     m1.DOnTime = 3600;
     m1.DOffTime = 3600;
     m1.STime = 8 * 3600;
     m1.ETime = 18 * 3600;
     m1.Senlist.push("S01C02T02"); /// 습도센서 지정
     m1.Senlist.push("S01C03T06"); /// Co2센서 지정  센서가 업더라도 지정꼭해야함
     m1.DTValue = 85.0; // 습도값
     m1.NTValue = 350.0; // co2 값
     m1.BValue = 1;
     m1.Cdir = KDDefine.SensorConditionType.SCT_UP;
     mcfglist.push(m1);

    ///습도제어 습도를 높임
    m1 = new AutoControlconfig();
    m1.Lid = "LT_ANAME_HUMIDITY";
    m1.Name = "습도제어";
    m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
    m1.Enb = false;
    m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
    m1.Cat = KDDefine.AUTOCategory.ACT_HEATER_HUMIDITY_FOR_FJBOX; //  자동제어 분류
    m1.Actlist.push("N01C03T00"); ///습도 히터  장비가 여려개이면 장비종류로 구별하자
    m1.DOnTime = AutoControlconfig.OnTimesecMAX;
    m1.DOffTime = 0;
    m1.STime = 8 * 3600;
    m1.ETime = 18 * 3600;
    m1.Senlist.push("S01C02T02"); /// 습도센서 지정
    m1.DTValue = 35.0; // 습도값
    m1.NTValue = 30.0; // 
    m1.BValue = 10;
    m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
    mcfglist.push(m1);

     ///co2제어 co2  공급해서 높임
     m1 = new AutoControlconfig();
     m1.Lid = "LT_ANAME_CO2";
     m1.Name = "CO2제어";
     m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
     m1.Enb = false;
     m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
     m1.Cat = KDDefine.AUTOCategory.ACT_AIR_CO2_FOR_FJBOX; //  자동제어 분류
     m1.Actlist.push("N01C04T00"); /// co2밸브  장비가 여려개이면 장비종류로 구별하자
     m1.DOnTime = 10;
     m1.DOffTime = 600;
     m1.STime = 8 * 3600;
     m1.ETime = 18 * 3600;
     m1.Senlist.push("S01C03T06"); /// CO2센서 지정
     m1.DTValue = 350.0; // CO2값
     m1.NTValue = 300.0; // 
     m1.BValue = 50;
     m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
     mcfglist.push(m1);

    ///PH ec 양액 공급
     m1 = new AutoControlconfig();
     m1.Lid = "LT_ANAME_NUTRIENT";
     m1.Name = "양액제어";
     m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
     m1.Enb = false;
     m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
     m1.Cat = KDDefine.AUTOCategory.ACT_NUTRIENT_SOL3_FOR_FJBOX; //  자동제어 분류
     m1.Actlist.push("N01C17T00"); /// 양액 솔밸브 
     m1.Actlist.push("N01C18T00");
     m1.Actlist.push("N01C19T00");
     m1.DOnTime = 10;
     m1.DOffTime = 600;
     m1.STime = 8 * 3600;
     m1.ETime = 18 * 3600;
     m1.Senlist.push("S01C02T16"); /// ph센서 지정
     m1.Senlist.push("S01C02T17"); /// ec센서 지정
     m1.DTValue = 6.0; //  pH
     m1.NTValue = 1.0; // EC
     m1.BValue = 0;
     m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
     mcfglist.push(m1);



    } 
    
    //카메라 제어 공통
    if (modelname === "KPC480" || modelname === "KPC200") {

      ///카메라 제어
      let m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_CAMERA";
      m1.Name = "카메라제어(RGB)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = true;
      m1.AType = KDDefine.AUTOType.ACM_TIMER_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ACT_CAMERA_FJBOX; //  자동제어 분류
      m1.Actlist.push(KDDefine.CameraType.CT_RGB); ///
      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.NOnTime = 0;
      m1.NOffTime = 0;
      m1.STime = 6 * 3600; //아침 6시 저녁 6시  촬영
      m1.ETime = 0;
      m1.DTValue = 2; // 매일 촬영 회수를 여기다 설정   1,2,4,8  로만지정
      m1.BValue = 0;
      m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
      m1.Params.push(2);  // 일 2회
      mcfglist.push(m1);

    }

    

    return mcfglist;
  }

  static getTestconfig() {
    let m1 = new AutoControlconfig();

    m1.Name = "사용자제어(테스트)";
    m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
    m1.Enb = true;
    m1.AType = KDDefine.AUTOType.ACM_TIMER_ONLY_DAY;

    m1.Cat = KDDefine.AUTOCategory.ATC_USER; //  자동제어 분류
    m1.Actlist.push("N01C00T00"); ///
    
    m1.DOnTime = AutoControlconfig.OnTimesecMAX;
    m1.DOffTime = 0;
    m1.NOnTime = 0;
    m1.NOffTime = 0;

    m1.STime = 8 * 3600;
    m1.ETime = 15 * 3600 + 1200;
    m1.DTValue = 0;
    m1.BValue = 0;
    m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;

    
    return m1;
  }
};
