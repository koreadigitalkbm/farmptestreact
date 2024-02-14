
//구동기 노드  기본 시간(초)으로 on , off  기능만으로 작동하자.
const ActuatorStatus    = require("../../frontend/myappf/src/commonjs/actuatorstatus.js");
const KDDefine          = require("../../frontend/myappf/src/commonjs/kddefine");
const ActuatorOperation = require("../../frontend/myappf/src/commonjs/actuatoroperation");

module.exports = class ActuatorNode {
  static ACTNODEType = Object.freeze({
    ANT_VFC24M: 0,  /// 인도어팜 구동기노드
    ANT_KPC480: 1,  /// 식물재배기 전문가용
    ANT_KPC200: 2,  /// 식물재배기 교육용  버전 1,2 
    ANT_VFC3300: 3,   // 기존 인도어팜 재배기 

  });

  constructor(slaveid, nodemodel, mmaster) {
    this.OnOffoperationregstartaddress = 601;
    this.OnOffstatusregstartaddress = 301;
    this.DefaultTimeoutmsec = 200;

    this.SlaveID = slaveid;
    this.modbusMaster = mmaster;
    this.maxchannelnumber = 24;

    this.node_error_count = 0;
    this.node_is_disconnect = true;
    this.actlist = [];

    if (nodemodel == ActuatorNode.ACTNODEType.ANT_VFC24M) {
      this.maxchannelnumber = 24;
      for (let i = 0; i < this.maxchannelnumber; i++) {
        let sv = new ActuatorStatus(ActuatorStatus.makeactuatoruniqid(this.SlaveID, i, KDDefine.HardwareTypeEnum.HT_RELAY));
        this.actlist.push(sv);
      }
    } else if (nodemodel == ActuatorNode.ACTNODEType.ANT_KPC480 || nodemodel == ActuatorNode.ACTNODEType.ANT_KPC300 || nodemodel == ActuatorNode.ACTNODEType.ANT_KPC200) {
      //ac trac 16개 dc mosfet 8  pwm 4개 기타 2개 , 30 개 넘으면 한번에 못읽음.
      this.maxchannelnumber = 30;  
      let sv;
      for (let i = 0; i < 24; i++) {
        sv = new ActuatorStatus(ActuatorStatus.makeactuatoruniqid(this.SlaveID, i, KDDefine.HardwareTypeEnum.HT_RELAY));
        this.actlist.push(sv);
      }

      sv = new ActuatorStatus(ActuatorStatus.makeactuatoruniqid(this.SlaveID, 24, KDDefine.HardwareTypeEnum.HT_PWM));
      this.actlist.push(sv);
      sv = new ActuatorStatus(ActuatorStatus.makeactuatoruniqid(this.SlaveID, 25, KDDefine.HardwareTypeEnum.HT_PWM));
      this.actlist.push(sv);
      sv = new ActuatorStatus(ActuatorStatus.makeactuatoruniqid(this.SlaveID, 26, KDDefine.HardwareTypeEnum.HT_PWM));
      this.actlist.push(sv);
      sv = new ActuatorStatus(ActuatorStatus.makeactuatoruniqid(this.SlaveID, 27, KDDefine.HardwareTypeEnum.HT_PWM));
      this.actlist.push(sv);
      ///기타
      sv = new ActuatorStatus(ActuatorStatus.makeactuatoruniqid(this.SlaveID, 28, KDDefine.HardwareTypeEnum.HT_PWM));
      this.actlist.push(sv);
      // 냉난방제어
      sv = new ActuatorStatus(ActuatorStatus.makeactuatoruniqid(this.SlaveID, 29, KDDefine.HardwareTypeEnum.HT_PWM));
      this.actlist.push(sv);
      
      

    } else if ( nodemodel == ActuatorNode.ACTNODEType.ANT_VFC3300 ) {       // 기존 인도어팜 V2 
      //ac trac 16개 dc mosfet 8  pwm 4개
      this.maxchannelnumber = 24;
      let sv;
      for (let i = 0; i < 24; i++) {
        sv = new ActuatorStatus(ActuatorStatus.makeactuatoruniqid(this.SlaveID, i, KDDefine.HardwareTypeEnum.HT_RELAY));
        this.actlist.push(sv);
      }

    } else {
      this.maxchannelnumber = 24;
      for (let i = 0; i < this.maxchannelnumber; i++) {
        let sv = new ActuatorStatus(ActuatorStatus.makeactuatoruniqid(this.SlaveID, i, KDDefine.HardwareTypeEnum.HT_RELAY));
        this.actlist.push(sv);
      }
    }
  }

  async readRS485Registers(Regaddress, Reglength) {
    return new Promise((resolve, reject) => {
      this.modbusMaster.writeFC3(this.SlaveID, Regaddress, Reglength, function (err, data) {
        resolve(data);
        if (err) {
          if (this.node_error_count > 10) {
            console.log("ActuatorNode read error:" + this.node_error_count);
            console.log(err);
          }
        }
      });
    });
  }

  async writeRS485Registers(Regaddress, RegDatas) {
    return new Promise((resolve, reject) => {
      this.modbusMaster.writeFC16(this.SlaveID, Regaddress, RegDatas, function (err, data) {
        resolve(data);
        if (err) {
          console.log("ActuatorNode write error:" );
          console.log(err);
        }
      });
    });
  }

  // 모든 구동기상태를 한꺼번에 읽어옴
  async ReadStatusAll() {
    try {
      let regaddress = this.OnOffstatusregstartaddress;
      let rv1 = await this.readRS485Registers(regaddress, this.maxchannelnumber * 4);
      if (rv1 != undefined) {
        
        for (let i = 0; i < this.maxchannelnumber; i++) {
          let msat = rv1.data[i * 4 + 1];
          let mopid = rv1.data[i * 4 + 0];
          let mremain = ((rv1.data[i * 4 + 2] << 16) & 0xffff0000) | (rv1.data[i * 4 + 3] & 0xffff);
          this.actlist[i].updatestatus(msat, mopid, mremain);
          //console.log("ReadStatus ch: " +i+" state:"+ msat + " wopid : " + mopid);
        }
        //  console.log("-ActuatorNode ReadStatusAll------------------");

        return this.actlist;
      }
      else{
          console.log("-ActuatorNode ReadStatusAll undefined------------------");
      }

      return null;
    } catch (e) {
      console.log("ReadStatusAll error: " + e.toString());
      return null;
    }
  }
  /// 제어명령어 이함수 하나로만 작동하자
  async ControlNormal(moperation, channel) {
    try {
       console.log("-ControlNomal-----" + "ID :" + moperation.Uid +" ,cmd : " + moperation.Opcmd + " ,opid:"+moperation.Opid +", Timesec : "+moperation.Timesec);
     

      let regaddress = this.OnOffoperationregstartaddress + channel * 4;
      let regdatas = Array();

      regdatas[0] = moperation.Opcmd;
      regdatas[1] = moperation.Opid; //opid
      regdatas[2] = moperation.Timesec & 0xffff;
      regdatas[3] = (moperation.Timesec >> 16) & 0xffff;
      return  await this.writeRS485Registers(regaddress, regdatas);

    } catch (e) {
      console.log("-ControlNormal error:" + e.toString());
      return null;
    }
    return null;
  }

  async FixedLEDon(iskpc480)
  {
    
    console.log("FixedLEDon:");
    
    let white=100;
    const  red=0;
    const blue=0;
    // const  red=100;
    // const blue=100;
    if(iskpc480== true)
    {
      white=49;
    }


    const wopcmd = new ActuatorOperation("led", true, ActuatorOperation.Gettimewithparam(30, white));
    const ropcmd = new ActuatorOperation("led", true, ActuatorOperation.Gettimewithparam(30, red));
    const bopcmd = new ActuatorOperation("led", true, ActuatorOperation.Gettimewithparam(30, blue));

    

      let regaddress = this.OnOffoperationregstartaddress + 24 * 4;
      let regdatas = Array();

      regdatas[0] = wopcmd.Opcmd;
      regdatas[1] = wopcmd.Opid; //opid
      regdatas[2] = wopcmd.Timesec & 0xffff;
      regdatas[3] = (wopcmd.Timesec >> 16) & 0xffff;


      regdatas[4+0] = ropcmd.Opcmd;
      regdatas[4+1] = ropcmd.Opid; //opid
      regdatas[4+2] = ropcmd.Timesec & 0xffff;
      regdatas[4+3] = (ropcmd.Timesec >> 16) & 0xffff;


      
      regdatas[8+0] = bopcmd.Opcmd;
      regdatas[8+1] = bopcmd.Opid; //opid
      regdatas[8+2] = bopcmd.Timesec & 0xffff;
      regdatas[8+3] = (bopcmd.Timesec >> 16) & 0xffff;

      return  await this.writeRS485Registers(regaddress, regdatas);


  }

};
