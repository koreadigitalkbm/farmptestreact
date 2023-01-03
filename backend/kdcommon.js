const fs = require('fs');

//백엔드에서 공통으로 사용되는 함수들
module.exports = class KDCommon {

  static systemconfigfilename = "../common/local_files/systemconfig.json";
  static autocontrolconfigfilename = "../common/local_files/autocontrolconfig.json";
  static  actuatorconfigfilename = "../common/local_files/actuatorconfig.json";
  static  actuatorconfigfilename_kpc480 ="../common/local_files/actuatorconfig_kpc480.json";
  static  actuatorconfigfilename_kpc200 ="../common/local_files/actuatorconfig_kpc200.json";
//json 형태로 저장함
  static Writefilejson(filename, mconfig)
    {
        let data = JSON.stringify(mconfig);
        fs.writeFileSync(filename, data);

    }
    //json 파일을 읽어서 object로 파싱함
    static  Readfilejson(filename)
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
    

  static getFoodJukebox_Productid() {
    return 0xfc21;
  }

  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
//현재시간 초단위로
  static getCurrentTotalsec()
  {
    const clocknow = new Date();
    const totalsec = clocknow.getHours() * 3600 + clocknow.getMinutes() * 60 + clocknow.getSeconds();
    return totalsec;
  }

};
