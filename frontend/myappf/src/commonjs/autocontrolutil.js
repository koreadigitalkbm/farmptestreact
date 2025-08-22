/// 자동제어 관련 API 모음
const AutoControlconfig = require("./autocontrolconfig");
const KDDefine = require("./kddefine");

module.exports = class AutoControlUtil {

  //PWM 방식으로 동작할때 주기 분으로 계산  
  static Getintervaltimeminute(OnTime,OffTime )
  {
    //let minute= (OnTime/60.0 + OffTime/60.0);
    //20240909 그냥 간단하게 변경 off 시간이 주기임.
    let minute= Number(OffTime/60.0);
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
    console.log("CreateDefaultConfig modelname : " +modelname );

    

    
    if ( modelname === KDDefine.PModel.KPC880E) { // 식물재배기 창문형

      

      
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
m1.Actlist.push("N01C02T00"); ///내부냉난방팬 릴레이 장비
m1.DOnTime = AutoControlconfig.OnTimesecMAX;
m1.DOffTime = 0;
m1.STime = 8 * 3600;
m1.ETime = 18 * 3600;
m1.Senlist.push("S01C00T01"); /// 온도센서 지정
m1.DTValue = 24.0;
m1.NTValue = 20.0;
m1.BValue = 5;
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
      m1.Actlist.push("N01C06T00"); ///관수 릴레이 장비
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
      m1.Lid = "LT_ANAME_LED_ONOFF";
      m1.Name = "LED 광량제어(타이머)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_TIMER_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ATC_LED_ONOFF; //  자동제어 분류
      m1.Actlist.push("N01C07T00"); ///
      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.NOnTime = 0;
      m1.NOffTime = 0;
      m1.STime = 8 * 3600;
      m1.ETime = 15 * 3600 + 1200;
      m1.DTValue = 0;
      m1.BValue = 0;
      m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
      m1.Params.push(100);
      mcfglist.push(m1);


      
          ///순환 제어
          m1 = new AutoControlconfig();
          m1.Lid = "LT_ANAME_AIR_CIRCULATION";
          m1.Name = "공기순환제어(타이머)";
          m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
          m1.Enb = false;
          m1.AType = KDDefine.AUTOType.ACM_TIMER_ONLY_DAY;
          m1.Cat = KDDefine.AUTOCategory.ACT_AIR_CIRU_TIMER_FOR_MINIHOUSE; //  자동제어 분류
          m1.Actlist.push("N01C03T00"); ///내부유동팬 릴레이 장비
          m1.DOnTime = 1800;
          m1.DOffTime = 300;
          m1.NOnTime = 0;
          m1.NOffTime = 0;
          m1.STime = 8 * 3600;
          m1.ETime = 18 * 3600 ;
          m1.DTValue = 0;
          m1.BValue = 0;
          m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
          m1.Params.push(100);
          mcfglist.push(m1);


      ///환기 제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_AIR_VENTILATION";
      m1.Name = "환기제어(CO2,습도)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX; //  자동제어 분류
      m1.Actlist.push("N01C05T00"); ///환기팬, 환기밸브  장비가 여려개이면 장비종류로 구별하자
      m1.DOnTime = 3600;
      m1.DOffTime = 3600;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C00T02"); /// 습도센서 지정
      m1.Senlist.push("S01C00T06"); /// Co2센서 지정  센서가 업더라도 지정꼭해야함
      m1.DTValue = 85.0; // 습도값
      m1.NTValue = 350.0; // co2 값
      m1.BValue = 1;
      m1.Cdir = KDDefine.SensorConditionType.SCT_UP;
      mcfglist.push(m1);




    }


    if ( modelname === KDDefine.PModel.KPC880D) { //미니온실

      let m1 = new AutoControlconfig();


       //////////////////////////온도제어 단순 on off 제어  추가 20250822
      m1.Lid = "LT_ANAME_TEMP";
      m1.Name = "온도제어(냉난방)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
      m1.Cat = KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX; //  자동제어 분류
      m1.Actlist.push("N01C00T00"); ///히터 릴레이 장비
      m1.Actlist.push("N01C01T00"); ///쿨러 릴레이 장비
      m1.Actlist.push("N01C02T00"); ///내부냉난방팬 릴레이 장비
      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C00T01"); /// 온도센서 지정
      m1.DTValue = 24.0;
      m1.NTValue = 20.0;
      m1.BValue = 5;
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
      m1.Actlist.push("N01C16T00"); ///관수 릴레이 장비
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
      m1.Lid = "LT_ANAME_LED_ONOFF";
      m1.Name = "LED 광량제어(타이머)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_TIMER_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ATC_LED_ONOFF; //  자동제어 분류
      m1.Actlist.push("N01C08T00"); ///
      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.NOnTime = 0;
      m1.NOffTime = 0;
      m1.STime = 8 * 3600;
      m1.ETime = 15 * 3600 + 1200;
      m1.DTValue = 0;
      m1.BValue = 0;
      m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
      m1.Params.push(100);
      mcfglist.push(m1);
      
      ///환기 제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_AIR_VENTILATION";
      m1.Name = "환기제어(CO2,습도)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ACT_AIR_VENT_CO2_HUMIDITY_FOR_MINIHOUSE; //  자동제어 분류
      m1.Actlist.push("N01C11T00"); ///환기팬, 환기밸브  장비가 여려개이면 장비종류로 구별하자
      //m1.Actlist.push("N01C12T00"); /// 유동팬  장비가 여려개이면 장비종류로 구별하자
      m1.DOnTime = 3600;
      m1.DOffTime = 3600;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C00T02"); /// 습도센서 지정
      m1.Senlist.push("S01C00T06"); /// Co2센서 지정  센서가 업더라도 지정꼭해야함
      m1.DTValue = 85.0; // 습도값
      m1.NTValue = 350.0; // co2 값
      m1.BValue = 1;
      m1.Cdir = KDDefine.SensorConditionType.SCT_UP;
      mcfglist.push(m1);


          ///순환 제어
          m1 = new AutoControlconfig();
          m1.Lid = "LT_ANAME_AIR_CIRCULATION";
          m1.Name = "공기순환제어(타이머)";
          m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
          m1.Enb = false;
          m1.AType = KDDefine.AUTOType.ACM_TIMER_ONLY_DAY;
          m1.Cat = KDDefine.AUTOCategory.ACT_AIR_CIRU_TIMER_FOR_MINIHOUSE; //  자동제어 분류
          m1.Actlist.push("N01C12T00"); /// 유동팬  장비가 여려개이면 장비종류로 구별하자
          m1.DOnTime = 1800;
          m1.DOffTime = 300;
          m1.NOnTime = 0;
          m1.NOffTime = 0;
          m1.STime = 8 * 3600;
          m1.ETime = 18 * 3600 ;
          m1.DTValue = 0;
          m1.BValue = 0;
          m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
          m1.Params.push(100);
          mcfglist.push(m1);

          

      
      
       ///습도제어 습도를 높임
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_HUMIDITY";
      m1.Name = "습도제어";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
      m1.Cat = KDDefine.AUTOCategory.ACT_HEATER_HUMIDITY_FOR_MINIHOUSE; //  자동제어 분류
      m1.Actlist.push("N01C10T00"); ///가습장비
      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.NOnTime = AutoControlconfig.OnTimesecMAX;
      m1.NOffTime = 0;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C00T02"); /// 습도센서 지정
      m1.DTValue = 35.0; // 습도값
      m1.NTValue = 30.0; // 
      m1.BValue = 10;
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
        m1.Actlist.push("N01C13T00"); /// 양액 솔밸브 
        m1.Actlist.push("N01C14T00");
        m1.Actlist.push("N01C15T00");
        
        
        m1.DOnTime = 10;
        m1.DOffTime = 600;
        m1.STime = 8 * 3600;
        m1.ETime = 18 * 3600;
        m1.Senlist.push("S01C02T16"); /// ph센서 지정 센서노드  3번 채널 고정 PE350
        m1.Senlist.push("S01C02T17"); /// ec센서 지정   3번 채널고정 
        m1.DTValue = 6.0; //  pH
        m1.NTValue = 1.0; // EC
        m1.BValue = 0;
        m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
        mcfglist.push(m1);
        


      ///스크린 보온덥걔 제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_SCREEN";
      m1.Name = "차광커튼제어";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ACT_SCREEN_FOR_MINIHOUSE; //  자동제어 분류
      m1.Actlist.push("N01C22T01"); ///스크린 장비번호
      m1.DOnTime = 60; //개폐기 열기 닫기 시간 초
      m1.DOffTime = 0;
      m1.STime = 18 * 3600;
      m1.ETime = 6 * 3600;
      m1.Senlist.push("S01C01T08"); /// 일사
      m1.DTValue = 100.0; // 온도값
      m1.NTValue = 0.0; // 밤온도값
      m1.BValue = 10.0;
      m1.Cdir = KDDefine.SensorConditionType.SCT_UP;
      mcfglist.push(m1);

      ///측창 제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_TOP_WINDOWS";
      m1.Name = "천창제어(온도)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ACT_WINDOW_FOR_MINIHOUSE; //  자동제어 분류
      m1.Actlist.push("N01C20T01"); // 장비번호
      m1.Actlist.push("N01C21T01"); // 장비번호
      m1.DOnTime = 60; //개폐기 열기 닫기 시간 초
      m1.DOffTime = 0;
      m1.STime = 8 * 3600;
      m1.ETime = 16 * 3600;
      m1.Senlist.push("S01C00T01"); /// 온도
      m1.DTValue = 25.0; // 온도값
      m1.NTValue = 20.0; // 밤온도값
      m1.BValue = 2.0;
      m1.Cdir = KDDefine.SensorConditionType.SCT_UP;
      m1.Params.push(true);
      mcfglist.push(m1);





    }


    if ( modelname === KDDefine.PModel.KPC880A) {

      

      //내부온습도 4번 채널, 5번 co2, 6번 외부온습도, 0번 EC, 1번 pH
      //////////////////////////온도제어
      let m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_TEMP";
      m1.Name = "온도제어(냉난방)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
      m1.Cat = KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX; //  자동제어 분류
      m1.Actlist.push("N01C20T00"); ///히터 릴레이 장비
      m1.Actlist.push("N01C21T00"); ///쿨러 릴레이 장비
      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C00T01"); /// 온도센서 지정
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
      m1.Actlist.push("N01C16T00"); ///관수 릴레이 장비
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
      m1.Params.push(75);
      m1.Params.push(60);
      m1.Params.push(50);
      mcfglist.push(m1);
      
      ///환기 제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_AIR_VENTILATION";
      m1.Name = "환기제어(CO2,습도)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX; //  자동제어 분류
      m1.Actlist.push("N01C18T00"); ///환기팬, 환기밸브  장비가 여려개이면 장비종류로 구별하자
      m1.DOnTime = 3600;
      m1.DOffTime = 3600;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C00T02"); /// 습도센서 지정
      m1.Senlist.push("S01C00T06"); /// Co2센서 지정  센서가 업더라도 지정꼭해야함
      m1.DTValue = 85.0; // 습도값
      m1.NTValue = 350.0; // co2 값
      m1.BValue = 1;
      m1.Cdir = KDDefine.SensorConditionType.SCT_UP;
      mcfglist.push(m1);



    }

    //양액기 및 온도 단순제어용 교육용 식물재배기
    if ( modelname === KDDefine.PModel.KPC880NB) {
      
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
m1.Actlist.push("N01C02T00"); ///내부냉난방팬 릴레이 장비
m1.DOnTime = AutoControlconfig.OnTimesecMAX;
m1.DOffTime = 0;
m1.STime = 8 * 3600;
m1.ETime = 18 * 3600;
m1.Senlist.push("S01C00T01"); /// 온도센서 지정
m1.DTValue = 24.0;
m1.NTValue = 20.0;
m1.BValue = 5;
m1.Cdir = KDDefine.SensorConditionType.SCT_DOWNBOTHIDLE;
mcfglist.push(m1);


///순환 제어
m1 = new AutoControlconfig();
m1.Lid = "LT_ANAME_AIR_CIRCULATION";
m1.Name = "공기순환제어(타이머)";
m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
m1.Enb = false;
m1.AType = KDDefine.AUTOType.ACM_TIMER_ONLY_DAY;
m1.Cat = KDDefine.AUTOCategory.ACT_AIR_CIRU_TIMER_FOR_MINIHOUSE; //  자동제어 분류
m1.Actlist.push("N01C07T00"); ///내부유동팬 릴레이 장비
m1.DOnTime = 1800;
m1.DOffTime = 300;
m1.NOnTime = 0;
m1.NOffTime = 0;
m1.STime = 8 * 3600;
m1.ETime = 18 * 3600 ;
m1.DTValue = 0;
m1.BValue = 0;
m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
m1.Params.push(100);
mcfglist.push(m1);

      
      //////////////////관수제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_WATER";
      m1.Name = "관수제어(타이머)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_TIMER_DAY_NIGHT;
      m1.Cat = KDDefine.AUTOCategory.ATC_WATER; //  자동제어 분류
      m1.Actlist.push("N01C16T00"); ///관수 릴레이 장비
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
      m1.Params.push(75);
      m1.Params.push(60);
      m1.Params.push(50);
      mcfglist.push(m1);
      


      ///환기 제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_AIR_VENTILATION";
      m1.Name = "환기제어(CO2,습도)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX; //  자동제어 분류
      m1.Actlist.push("N01C11T00"); ///환기팬, 환기밸브  장비가 여려개이면 장비종류로 구별하자
      m1.Actlist.push("N01C12T00"); //환기밸브
      m1.DOnTime = 3600;
      m1.DOffTime = 3600;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C00T02"); /// 습도센서 지정
      m1.Senlist.push("S01C00T06"); /// Co2센서 지정  센서가 업더라도 지정꼭해야함
      m1.DTValue = 85.0; // 습도값
      m1.NTValue = 350.0; // co2 값
      m1.BValue = 1;
      m1.Cdir = KDDefine.SensorConditionType.SCT_UP;
      mcfglist.push(m1);

      
          
        ///PH ec 양액 공급
        m1 = new AutoControlconfig();
        m1.Lid = "LT_ANAME_NUTRIENT";
        m1.Name = "양액제어";
        m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
        m1.Enb = false;
        m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
        m1.Cat = KDDefine.AUTOCategory.ACT_NUTRIENT_SOL3_FOR_FJBOX; //  자동제어 분류
        m1.Actlist.push("N01C13T00"); /// 양액 솔밸브 
        m1.Actlist.push("N01C14T00");
        m1.Actlist.push("N01C15T00");
        
        
        m1.DOnTime = 10;
        m1.DOffTime = 600;
        m1.STime = 8 * 3600;
        m1.ETime = 18 * 3600;
        m1.Senlist.push("S01C02T16"); /// ph센서 지정 센서노드  3번 채널 고정 PE350
        m1.Senlist.push("S01C02T17"); /// ec센서 지정   3번 채널고정 
        m1.DTValue = 6.0; //  pH
        m1.NTValue = 1.0; // EC
        m1.BValue = 0;
        m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
        mcfglist.push(m1);



    }


    
    if ( modelname === KDDefine.PModel.KPC880TB) {

      
      
      
      //////////////////////////온도제어
      let m1 = new AutoControlconfig();
      
      /*
      m1.Lid = "LT_ANAME_TEMP_CHILLER";
      m1.Name = "냉각수 온도 조절";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
      m1.Cat = KDDefine.AUTOCategory.ACT_CHILLER_TEMP_CONTROL_FOR_WATERTANK; //  자동제어 분류
      m1.Actlist.push("N01C00T00"); ///칠러장비
      m1.Actlist.push("N01C01T00"); ///펌프
      m1.Actlist.push("N01C08T00"); ///솔밸브 장비
      m1.Actlist.push("N01C09T00"); ///솔밸브 장비
      m1.Actlist.push("N01C10T00"); ///솔밸브 장비
      m1.Actlist.push("N01C11T00"); ///솔밸브 장비

      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C00T01"); /// 온도센서 지정
      m1.Senlist.push("S01C00T02"); /// 수위센서 지정
      m1.DTValue = 20.0;
      m1.NTValue = 18.0;
      m1.BValue = 2;
      m1.Cdir = KDDefine.SensorConditionType.SCT_UP; //온도가 올라가면 켜짐
      m1.Params.push(1.3); //P
      mcfglist.push(m1);

*/

      ///환수 제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_WATER_CHANGE";
      m1.Name = "물 교환,보충";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_TIMER_DAY_NIGHT;
      m1.Cat = KDDefine.AUTOCategory.ACT_PARTIAL_WATER_CHANGE_FOR_WATERTANK; //  자동제어 분류
      m1.Actlist.push("N01C00T00"); ///칠러장비
      m1.Actlist.push("N01C15T00"); ///펌프
      m1.Actlist.push("N01C08T00"); ///솔밸브 장비
      m1.Actlist.push("N01C09T00"); ///솔밸브 장비
      m1.Actlist.push("N01C10T00"); ///솔밸브 장비
      m1.Actlist.push("N01C11T00"); ///솔밸브 장비

      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.NOnTime = AutoControlconfig.OnTimesecMAX;
      m1.NOffTime = 0;
      m1.STime = 8 * 3600; //주간시간
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C00T01"); /// 온도센서 지정
      m1.Senlist.push("S01C00T02"); /// 수위센서 지정
      
      m1.DTValue = 20.0; //주간온도
      m1.NTValue = 18.0; // 야간온도
      m1.BValue = 1; //온도차 1도
      m1.Cdir = KDDefine.SensorConditionType.SCT_UP;//온도가 올라가면 켜짐

      m1.Params.push(1);  //0번째파라메터: 물 환수 횟수 일 1회  0일경우 환수안함.
      m1.Params.push(6*3600);  //1번째파라메터: 물 환수 시작시간 오전 6시
      m1.Params.push(600);  //2번째파라메터: 배수 최대시간 10분 동안만 작동 배수
      m1.Params.push(600);  //3번째파라메터: 급수 최대시간 10분 동안만 작동 보충
      m1.Params.push(500.0); //4번째파라메터: 배수 수위값 mm
      m1.Params.push(600.0); //5번째파라메터: 보충 수위값 mm        
     


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
      m1.Params.push(75);
      m1.Params.push(60);
      m1.Params.push(50);
      mcfglist.push(m1);
      


      

    }


    
    if ( modelname === KDDefine.PModel.KPC880B) {

      

      
      //////////////////////////온도제어
      let m1 = new AutoControlconfig();
      
      m1.Lid = "LT_ANAME_TEMP_PID";
      m1.Name = "온도제어(PID)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
      m1.Cat = KDDefine.AUTOCategory.ACT_PID_TEMP_CONTROL_FOR_FJBOX; //  자동제어 분류
      m1.Actlist.push("N01C28T03"); ///온도제어 장비 고정 
      m1.Actlist.push("N01C00T00"); ///히터 릴레이 장비
      m1.Actlist.push("N01C01T00"); ///쿨러 릴레이 장비
      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C00T01"); /// 온도센서 지정
      m1.DTValue = 26.0;
      m1.NTValue = 21.0;
      m1.BValue = 1;
      m1.Cdir = KDDefine.SensorConditionType.SCT_DOWNBOTHIDLE;
      m1.Params.push(1.3); //P
      m1.Params.push(0.01);//I
      m1.Params.push(2.1);//D
      mcfglist.push(m1);

      
      //////////////////관수제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_WATER";
      m1.Name = "관수제어(타이머)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_TIMER_DAY_NIGHT;
      m1.Cat = KDDefine.AUTOCategory.ATC_WATER; //  자동제어 분류
      m1.Actlist.push("N01C16T00"); ///관수 릴레이 장비
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
      m1.Params.push(75);
      m1.Params.push(60);
      m1.Params.push(50);
      mcfglist.push(m1);
      


      ///환기 제어
      m1 = new AutoControlconfig();
      m1.Lid = "LT_ANAME_AIR_VENTILATION";
      m1.Name = "환기제어(CO2,습도)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = false;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX; //  자동제어 분류
      m1.Actlist.push("N01C11T00"); ///환기팬, 환기밸브  장비가 여려개이면 장비종류로 구별하자
      m1.Actlist.push("N01C12T00"); //환기밸브
      m1.DOnTime = 3600;
      m1.DOffTime = 3600;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C00T02"); /// 습도센서 지정
      m1.Senlist.push("S01C00T06"); /// Co2센서 지정  센서가 업더라도 지정꼭해야함
      m1.DTValue = 85.0; // 습도값
      m1.NTValue = 350.0; // co2 값
      m1.BValue = 1;
      m1.Cdir = KDDefine.SensorConditionType.SCT_UP;
      mcfglist.push(m1);



    }


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
      m1.Lid = "LT_ANAME_AIR_VENTILATION";
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

      let m1;

      /*
     //////////////////////////온도제어
     m1 = new AutoControlconfig();
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
*/


     //////////////////////////온도제어 PID
     m1 = new AutoControlconfig();
     m1.Lid = "LT_ANAME_TEMP_PID";
     m1.Name = "온도제어(PID)";
     m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
     m1.Enb = false;
     m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
     m1.Cat = KDDefine.AUTOCategory.ACT_PID_TEMP_CONTROL_FOR_FJBOX; //  자동제어 분류
     m1.Actlist.push("N01C29T02"); ///온도제어 장비 고정 
     m1.Actlist.push("N01C00T00"); ///히터 릴레이 장비
     m1.Actlist.push("N01C01T00"); ///쿨러 릴레이 장비
     m1.DOnTime = AutoControlconfig.OnTimesecMAX;
     m1.DOffTime = 0;
     m1.STime = 8 * 3600;
     m1.ETime = 18 * 3600;
     m1.Senlist.push("S01C02T01"); /// 온도센서 지정
     m1.DTValue = 26.0;
     m1.NTValue = 21.0;
     m1.BValue = 1;
     m1.Cdir = KDDefine.SensorConditionType.SCT_DOWNBOTHIDLE;
     m1.Params.push(1.3); //P
     m1.Params.push(0.01);//I
     m1.Params.push(1);//D
     
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
     m1.Lid = "LT_ANAME_AIR_VENTILATION";
     m1.Name = "환기제어(CO2,습도)";
     m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
     m1.Enb = false;
     m1.AType = KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY;
     m1.Cat = KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX; //  자동제어 분류
     m1.Actlist.push("N01C06T00"); ///환기팬, 환기밸브  장비가 여려개이면 장비종류로 구별하자
     m1.Actlist.push("N01C20T00"); //환기 밸브 DC
     m1.DOnTime = 3600;
     m1.DOffTime = 3600;
     m1.STime = 8 * 3600;
     m1.ETime = 18 * 3600;
     m1.Senlist.push("S01C02T02"); /// 습도센서 지정
     m1.Senlist.push("S01C02T06"); /// Co2센서 지정  센서가 업더라도 지정꼭해야함
     m1.DTValue = 85.0; // 습도값
     m1.NTValue = 350.0; // co2 값
     m1.BValue = 1;
     m1.Cdir = KDDefine.SensorConditionType.SCT_UP;
     mcfglist.push(m1);

     /*
    ///습도제어 습도를 높임
    m1 = new AutoControlconfig();
    m1.Lid = "LT_ANAME_HUMIDITY";
    m1.Name = "습도제어";
    m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
    m1.Enb = false;
    m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
    m1.Cat = KDDefine.AUTOCategory.ACT_HEATER_HUMIDITY_FOR_FJBOX; //  자동제어 분류
    m1.Actlist.push("N01C30T02"); ///습도 PID 전용채널 30번
    m1.Actlist.push("N01C13T00"); ///펌프장비
    m1.DOnTime = AutoControlconfig.OnTimesecMAX;
    m1.DOffTime = 0;
    m1.NOnTime = AutoControlconfig.OnTimesecMAX;
    m1.NOffTime = 0;
    m1.STime = 8 * 3600;
    m1.ETime = 18 * 3600;
    m1.Senlist.push("S01C02T02"); /// 습도센서 지정
    m1.DTValue = 35.0; // 습도값
    m1.NTValue = 30.0; // 
    m1.BValue = 10;
    m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
    mcfglist.push(m1);
*/

    

     //////////////////////////습도제어 PID
     m1 = new AutoControlconfig();
     m1.Lid = "LT_ANAME_HUMIDITY_PID";
     m1.Name = "습도제어(PID)";
     m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
     m1.Enb = false;
     m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
     m1.Cat = KDDefine.AUTOCategory.ACT_PID_HEATER_HUMIDITY_FOR_FJBOX; //  자동제어 분류
     m1.Actlist.push("N01C03T00"); ///습도 히터  장비가 여려개이면 장비종류로 구별하자
     m1.Actlist.push("N01C13T00"); ///펌프장비
     m1.DOnTime = AutoControlconfig.OnTimesecMAX;
     m1.DOffTime = 0;
     m1.STime = 8 * 3600;
     m1.ETime = 18 * 3600;
     m1.Senlist.push("S01C02T02"); /// 온도센서 지정
     m1.DTValue = 50.0;
     m1.NTValue = 30.0;
     m1.BValue = 5;
     m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
     m1.Params.push(1); //P
     m1.Params.push(0.01);//I
     m1.Params.push(1);//D
     
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
     m1.Senlist.push("S01C02T06"); /// CO2센서 지정
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
     m1.Actlist.push("N01C12T00");  // 양액교반 펌프
     
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

    if (modelname === "KPC300" ) {

      let m1;

      
     //////////////////////////온도제어 PID
     m1 = new AutoControlconfig();
     m1.Lid = "LT_ANAME_TEMP_PID";
     m1.Name = "온도제어(PID)";
     m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
     m1.Enb = false;
     m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
     m1.Cat = KDDefine.AUTOCategory.ACT_PID_TEMP_CONTROL_FOR_FJBOX; //  자동제어 분류
     m1.Actlist.push("N01C29T02"); ///온도제어 장비 고정 
     m1.Actlist.push("N01C00T00"); ///히터 릴레이 장비
     m1.Actlist.push("N01C01T00"); ///쿨러 릴레이 장비
     m1.DOnTime = AutoControlconfig.OnTimesecMAX;
     m1.DOffTime = 0;
     m1.STime = 8 * 3600;
     m1.ETime = 18 * 3600;
     m1.Senlist.push("S01C02T01"); /// 온도센서 지정
     m1.DTValue = 26.0;
     m1.NTValue = 21.0;
     m1.BValue = 1;
     m1.Cdir = KDDefine.SensorConditionType.SCT_DOWNBOTHIDLE;
     m1.Params.push(1.3); //P
     m1.Params.push(0.01);//I
     m1.Params.push(2.1);//D
     
     mcfglist.push(m1);


     //////////////////관수제어
     m1 = new AutoControlconfig();
     m1.Lid = "LT_ANAME_WATER";
     m1.Name = "관수제어(타이머)";
     m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
     m1.Enb = false;
     m1.AType = KDDefine.AUTOType.ACM_TIMER_DAY_NIGHT;
     m1.Cat = KDDefine.AUTOCategory.ATC_WATER; //  자동제어 분류
     m1.Actlist.push("N01C16T00"); ///관수 릴레이 장비
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
     m1.Lid = "LT_ANAME_AIR_VENTILATION";
     m1.Name = "환기제어(CO2,습도)";
     m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
     m1.Enb = false;
     m1.AType = KDDefine.AUTOType.ACM_SENSOR_ONLY_DAY;
     m1.Cat = KDDefine.AUTOCategory.ACT_AIRCIRC_CO2_HUMIDITY_FOR_FJBOX; //  자동제어 분류
     m1.Actlist.push("N01C06T00"); ///환기팬, 환기밸브  장비가 여려개이면 장비종류로 구별하자
     m1.Actlist.push("N01C20T00"); //환기 밸브 DC
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

    



    } 

    
    //카메라 제어 공통
    if (modelname === "KPC480" || modelname === "KPC300" || modelname === "KPC200" || modelname === KDDefine.PModel.KPC880A || modelname === KDDefine.PModel.KPC880B || modelname === KDDefine.PModel.KPC880NB || modelname === KDDefine.PModel.KPC880TB) {

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
