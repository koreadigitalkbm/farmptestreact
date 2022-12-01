const fs = require('fs');

//장비 기본 설정 파일
module.exports = class DeviceSystemconfig {
    static Writefile(filename, mconfig)
    {
        let data = JSON.stringify(mconfig);
        fs.writeFileSync(filename, data);

    }
    static  Readfile(filename)
    {

      try{
        let rawdata = fs.readFileSync(filename);
        let objlist = JSON.parse(rawdata);
        return objlist;
      }
      catch (error) {
        return null;
      }
    }
    constructor() {
      this.name = "팜스큐브시스템설정";
      this.deviceuniqid = "IFINIT";
      this.comport="COM11";
      this.password="1234";
      
    }
    
  };
  