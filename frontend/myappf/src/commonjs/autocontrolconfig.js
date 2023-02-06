const KDDefine = require("./kddefine");

module.exports = class AutoControlconfig {

  static OnTimesecMAX = 1000000; //해당값이면 무한히 켜는상태임 
  static DayTimesecMAX = 24*3600; 

    static deepcopy(mobj) {
        return Object.assign(new AutoControlconfig(), mobj);
      }




    constructor() {
      //통신으로 보내야하니 최대한 짧게변수명 지정
      //자동제어 고유id 자동생성
      this.Uid= "AID"+ Math.random().toString(36).substr(2, 16);
      this.Name = "자동제어";
      this.Lid= null;// 자동제어 고정일때 다국어지원하기 위해 넣음 사용자제어일경우  null로 지정
      this.Enb=false; // ture: 자동 false: 수동(작동중지)
      
      this.AType=KDDefine.AUTOType.ACM_TIMER_ONLY_DAY; // ture: 타이머제어(시간) false: 센서제어


      this.Cat=KDDefine.AUTOCategory.ATC_USER;  //  자동제어 분류
      this.Pri= KDDefine.AUTOPriority.AP_NORMAL; // 기본우선순위

      

      this.Cat=KDDefine.AUTOCategory.ATC_USER;  //  자동제어 분류
      this.Actlist=[]; // 구동기 UID  목록 최소 1개
      this.Senlist=[]; // 센서 UID  목록  센서제어시필요  추후에 여러개가 필요할지 모르니 우선 리스트로 만듬.


      // 주간시간 이외는 야간시간
      this.STime=0;//시작시간 초단위 number 
      this.ETime= 12*3600; // 종료시간 초단위 24시간넘어가면 하루종일이라는 뜻임.


      
      this.DOnTime=60; // On 시간초   주간
      this.DOffTime=60; // Off 시간초 0:이면  1회성 그외는 PWM 주기적제어  

      this.NOnTime=60; // 야간 
      this.NOffTime=60; // 야간


      this.DTValue= 10.0; //목표 센서값  float 주간
      this.NTValue= 10.0; //목표 센서값  float  야간
      this.BValue= 1; //범위 센서값  +- 
      this.Cdir= KDDefine.SensorConditionType.SCT_UP; // 센서 조건 "up" : 설정값보다 크면(>=) 켜짐 "down"  설정값보다작으면(<=) 켜짐

      this.Params=[]; // 구동기 제어시 필요한 파라메터 LED 디밍 ,  카메라경우 매일 촬영횟수


      

    }
   
   
    
  };
  