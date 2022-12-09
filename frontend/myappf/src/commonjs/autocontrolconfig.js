const KDDefine = require("./kddefine");

module.exports = class AutoControlconfig {

    static deepcopy(mobj) {
        return Object.assign(new AutoControlconfig(), mobj);
      }


    constructor() {
      //통신으로 보내야하니 최대한 짧게변수명 지정
      //자동제어 고유id 자동생성
      this.Uid= "AID"+ Math.random().toString(36).substr(2, 16);
      this.Name = "자동제어";
      this.Enb=false; // ture: 자동 false: 수동(작동중지)

      

      this.Cat=KDDefine.AUTOCategory.ATC_USER;  //  자동제어 분류
      this.Actlist=[]; // 구동기 UID  목록 최소 1개
      this.Senlist=[]; // 센서 UID  목록  센서제어시필요  추후에 여러개가 필요할지 모르니 우선 리스트로 만듬.


      this.STime=0;//시작시간 초단위 number 
      this.ETime= 12*3600; // 종료시간 초단위 24시간넘어가면 하루종일이라는 뜻임.


      this.TEnb=true; // ture: 타이머제어(시간) false: 센서제어
      this.OnTime=60; // On 시간초  
      this.OffTime=60; // Off 시간초 0:이면  1회성 그외는 PWM 주기적제어  

      this.TValue= 1.0; //목표 센서값  float
      this.BValue= 0.5; //범위 센서값  +- 
      this.Cdir= "up"; // 센서 조건 "up" : 설정값보다 크면(>=) 켜짐 "down"  설정값보다작으면(<=) 켜짐


      
    }
   
   
    
  };
  