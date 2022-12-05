//구동기 노드  기본 시간(초)으로 on , off  기능만으로 작동하자.
const ActuatorCompact = require("../frontend/myappf/src/commonjs/actuatorcompact.js");

module.exports = class ActuatorNode {


  static ONOFFOperationTypeEnum = Object.freeze({
  OPT_On : 201, // 작동시작
  OPT_Off: 0, // 작동 멈춤
  OPT_Timed_On : 202, // 정해진 시간동안 작동
  OPT_Driectional_On : 203, // 정해긴 방향으로 정해진 시간동안 동작
        
  });


  constructor(slaveid, maxchannel,mmaster) {
    this.OnOffoperationregstartaddress = 601;
    this.OnOffstatusregstartaddress = 301;
    this.DefaultTimeoutmsec = 200;

    this.SlaveID = slaveid;
    this.modbusMaster = mmaster;
    this.maxchannelnumber = maxchannel;
    this.hwtype= 0;

    this.node_error_count=0;
    this.node_is_disconnect=true;
    
    this.actlist=[];
    for(let i=0;i<this.maxchannelnumber;i++ )
    {
      let sv = new ActuatorCompact(this.SlaveID, i,this.hwtype, 0);
      this.actlist.push(sv);
    }

  }
  
   readRS485Registers(Regaddress, Reglength)
  {
    return new Promise((resolve, reject) => {
      this.modbusMaster.writeFC3(this.SlaveID, Regaddress,Reglength, function(err,data){
          resolve(data) ;
          if(err)
          {
            console.log(err);
          }

      } );
      
  });
  }

  
  writeRS485Registers(Regaddress, RegDatas)
  {
    return new Promise((resolve, reject) => {
      this.modbusMaster.writeFC16(this.SlaveID, Regaddress,RegDatas, function(err,data){
          resolve(data) ;
          if(err)
          {
            console.log(err);
          }
      } );
      
  });
  }
  



  async ReadStatus(channel, wopid) {
    try {
      if (channel < 24) {
     

        let regaddress = this.OnOffstatusregstartaddress + channel * 4;

        let rv1 = await this.readRS485Registers(regaddress, 4);
        if (rv1 != undefined) {
          console.log("ReadStatus : " + rv1.data.toString() + " wopid : " + wopid);
          if (rv1.data[0] == wopid || wopid == undefined) {
            return rv1.data[1];
          }
        }
      }

      return null;
    } catch (e) {
      console.log("ReadStatus error: " + e.toString());
      return null;
    }
  }

  async ReadStatusAll() {
    try {
      
     

        let regaddress = this.OnOffstatusregstartaddress  ;

        let rv1 = await this.readRS485Registers(regaddress, this.maxchannelnumber*4);
        if (rv1 != undefined) {
          //console.log("ReadStatus : " + rv1.data.toString() + " wopid : " + wopid);


          for(let i=0;i<this.maxchannelnumber;i++ )
          {
            let msat = rv1.data[i * 4 + 0];
            let mremain = ((rv1.data[i * 4 + 2]<<16 )&0xFFFF0000)  | (rv1.data[i * 4 + 3] &0xFFFF );
            this.actlist[i].updatestatus(msat,mremain);
          }

          console.log("-ActuatorNode ReadStatusAll------------------");

          
          return  this.actlist;

      
      }

      return null;
    } catch (e) {
      console.log("ReadStatusAll error: " + e.toString());
      return null;
    }
  }


  async ControlOnTimed(channel, ontimesec) {
    try {
      
      let regaddress = this.OnOffoperationregstartaddress + channel * 4;
      let regdatas = Array();

      regdatas[0] = ONOFFOperationTypeEnum.OPT_Timed_On;
      regdatas[1] = ONOFFOperationTypeEnum.OPT_Timed_On + channel * 1000; //opid
      regdatas[2] = ontimesec & 0xffff;
      regdatas[3] = (ontimesec >> 16) & 0xffff;
      let rv1 = await this.writeRS485Registers(regaddress, regdatas);

      if (rv1 != undefined) {
        let rstatus = await this.ReadStatus(channel, regdatas[1]);

        return rstatus;
      }

      return null;
    } catch (e) {}
  }

  
  async ControlOff(channel) {
    try {
      
      let regaddress = this.OnOffoperationregstartaddress + channel * 4;
      let regdatas = Array();

      regdatas[0] = ONOFFOperationTypeEnum.OPT_Off;
      regdatas[1] = ONOFFOperationTypeEnum.OPT_Off + channel * 1000; //opid
      regdatas[2] = 0;
      regdatas[3] = 0;
      let rv1 = await this.writeRS485Registers(regaddress, regdatas);

      if (rv1 != undefined) {
        let rstatus = await this.ReadStatus(channel, regdatas[1]);

        return rstatus;
      }

      return null;
    } catch (e) {}
  }




};
