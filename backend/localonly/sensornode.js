const SensorCompact = require("../../frontend/myappf/src/commonjs/sensorcompact.js");
const KDCommon = require("../kdcommon");

module.exports = class SensorNode {
  constructor(slaveid,regStartaddrss, mmaster, maxsensorcnt =20) {
    this.NodeName = "nuknown";
    this.DefaultTimeoutmsec = 300;
    this.SlaveID = slaveid;
    this.modbusMaster = mmaster;
    this.KDDefaultRegAddr = regStartaddrss; //kd 전용 센서값연속적
    this.node_error_count = 0;
    this.node_is_disconnect = true;
    this.node_product_code = 0;
    this.sensormaxcount = maxsensorcnt; //센서 최대연결갯수

    console.log("SensorNode sensormaxcount:" + this.sensormaxcount);

  }
  
  readRS485Registers(Regaddress, Reglength) {
    return new Promise((resolve, reject) => {
      this.modbusMaster.writeFC3(this.SlaveID, Regaddress, Reglength, function (err, data) {
        resolve(data);
        if (err) {
          if(this.node_error_count >10)
          {
          console.log("SensorNode read error:" + this.node_error_count );
          console.log(err);
          }
        }
      });
    });
  }

  async ReadSensorAll() {
    try {
     // console.log("ReadSensorAll node_is_disconnect: " + this.node_is_disconnect + " , SlaveID : " + this.SlaveID + ",node_error_count : " + this.node_error_count);
      //초기화 상태거나 에러상태이면 product code  값만 확인해서 정상적인지 확인함.
      if (this.node_is_disconnect == true) {
        const rvp = await this.readRS485Registers(4, 1);
        if (rvp != undefined) {
          this.node_product_code = rvp.data[0];
          this.node_is_disconnect = false;
          this.node_error_count = 0;
          console.log("node_product_code : " + this.node_product_code);
        } else {
          //console.log("ReadSensorAll await 500: ");
        }

        return null;
      }

      //30번 연속이면 센서노드 연결상태에러임.
      if (this.node_error_count > 30) {
        this.node_is_disconnect = true;
        return null;
      } else {
        this.node_is_disconnect = false;
      }

      this.node_error_count++;

      
      let regaddress = this.KDDefaultRegAddr;
      const rv1 = await this.readRS485Registers(regaddress, this.sensormaxcount * 3); 
      let svlist = [];
      if (rv1 != undefined) {

        this.node_error_count = 0;
        for (let i = 0; i <  this.sensormaxcount; i++) {
          let sv_float = Buffer.from([(rv1.data[i * 3 + 0] >> 0) & 0xff, (rv1.data[i * 3 + 0] >> 8) & 0xff, (rv1.data[i * 3 + 1] >> 0) & 0xff, (rv1.data[i * 3 + 1] >> 8) & 0xff]).readFloatLE(0);
          let sensorcode = rv1.data[i * 3 + 2];
          let sensorstatus = 0;
          if (sensorcode != 0) {
          
           // console.log("ReadSensor sensorcode : " + sensorcode);

            let sv = new SensorCompact(this.SlaveID, sensorcode, sv_float);
            svlist.push(sv);
            //센서가 읽히면 에러 카운트 0
            //console.log("ReadSensor sucess : " + sv_float.toString());
            
          }
        }

        //await KDCommon.delay(100);

        return svlist;
      } 
      return null;
    } catch (Err) {
     // console.log("ReadSensor fail :"+Err);
      return null;
    }
  }

  async ReadInfo() {
    try {
      
      return await this.modbusMaster.readHoldingRegisters(0, 8);
    } catch (error) {
      return null;
    }
  }

  
};
