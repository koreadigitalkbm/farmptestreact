

module.exports = class AutoControlconfig {

    static deepcopy(mobj) {
        return Object.assign(new AutoControlconfig(), mobj);
      }


    constructor() {

      //자동제어 고유id 자동생성
      this.Uid= "AID"+ Math.random().toString(36).substr(2, 16);
      this.Enb=false; // ture: 자동 false: 수동
      this.Name = "자동제어";


      /*
      this.category=0;

      
      
      this.starttime = 0;// 시작시간 초단위 number
      this.endtime = 24*3600;    // 종료시간 초단위
      this.devids=[];
      this.priority=0;
      this.istimer=true;

      this.sensorid="";
      this.onvalue=0;
      this.offvalue=0;

      this.condition="up";
      
      this.onetime_run=60;
      this.onetime_idle=60;
     

      this.pwmcontrolenable=false;
      this.pwmontime=5;
      this.pwmofftime=10;
      */
     
      
    }
   
   
    
  };
  