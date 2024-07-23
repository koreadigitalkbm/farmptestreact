const fs = require("fs");
const path = require('path');
const moment = require("moment");

//백엔드에서 공통으로 사용되는 함수들
module.exports = class KDCommon {
  static defaultlangfile = "../common/local_files/defaultlang.json";
  static langenglishfile = "../frontend/myappf/src/lang/lang.en.json";
  static langkoreanfile =  "../frontend/myappf/src/lang/lang.ko.json";

  static systemconfigfilename = "../common/local_files/systemconfig.json";
  static systemaliasfilename = "../common/local_files/systemalias.json";
  static autocontrolconfigfilename = "../common/local_files/autocontrolconfig.json";
  static actuatorconfigfilename = "../common/local_files/actuatorconfig.json";
  static actuatorconfigfilename_kpc480 = "../common/local_files/actuatorconfig_kpc480.json";
  static actuatorconfigfilename_kpc300 = "../common/local_files/actuatorconfig_kpc300.json";
  static actuatorconfigfilename_kpc200 = "../common/local_files/actuatorconfig_kpc200.json";
  static actuatorconfigfilename_vfc3300 = "../common/local_files/actuatorconfig_vfc3300.json";
  static actuatorconfigfilename_kpc880a = "../common/local_files/actuatorconfig_kpc880a.json";
  static actuatorconfigfilename_kpc880b = "../common/local_files/actuatorconfig_kpc880b.json";
  static actuatorconfigfilename_kpc880c = "../common/local_files/actuatorconfig_kpc880c.json";
  static actuatorconfigfilename_kpc880d = "../common/local_files/actuatorconfig_kpc880d.json";
  static actuatorconfigfilename_kpc880e = "../common/local_files/actuatorconfig_kpc880e.json";


  //json 형태로 저장함
  static Writefilejson(filename, mconfig) {
    let data = JSON.stringify(mconfig);
    fs.writeFileSync(filename, data);
  }
  //json 파일을 읽어서 object로 파싱함
  static Readfilejson(filename) {
    try {
      let rawdata = fs.readFileSync(filename);
      let objlist = JSON.parse(rawdata);
      return objlist;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  static getFoodJukebox_Productid() {
    return 0xfc21;
  }

  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //현재 시간 타임존 적용
  static getCurrentDate(timezoneoffset, isformat) {
    const dnow = new Date();

    const clocknow =new Date(dnow.getTime()+(dnow.getTimezoneOffset()*60*1000) + timezoneoffset);
    if(isformat ==true)
    {
      const datestr = moment(clocknow).format("YYYY-MM-DD HH:mm:ss");
      return datestr;
    }

    return clocknow;
  }


  //현재시간 초단위로
  static getCurrentTotalsec(timezoneoffset) {
  
    const clocknow =KDCommon.getCurrentDate(timezoneoffset,false);
    //console.log("getCurrentTotalec h:" + clocknow.getHours()  + " M: " + clocknow.getMinutes());
    const totalsec = clocknow.getHours() * 3600 + clocknow.getMinutes() * 60 + clocknow.getSeconds();
    return Number(totalsec);
  }

  

    //현재시간 분단위로
    static getCurrentTotalminute(timezoneoffset) {

      const clocknow =KDCommon.getCurrentDate(timezoneoffset,false);
      const totalmin = clocknow.getHours() * 60 + clocknow.getMinutes() ;
      return Number(totalmin);
    }


    static getSecondsonly() {
      const clocknow = new Date();
      return clocknow.getSeconds();
    }


    static getMinutesonly() {
      const clocknow = new Date();
      return clocknow.getMinutes();
    }

  static removeallfiles(dirPath)
  {

    
    const printResult = (err, result) => {
      if (err) return console.log(err);
    
      console.log(`${result} 를 정상적으로 삭제했습니다`);
    };


    try { 

      const removePath = (p, callback) => { // A 
        fs.stat(p, (err, stats) => { 
          if (err) return callback(err);
      
          if (!stats.isDirectory()) { // B 
            console.log('이 경로는 파일');
            return fs.unlink(p, err => err ? callback(err) : callback(null, p));
          }
      
          console.log('이 경로는 폴더');  // C 
          fs.rmdir(p, (err) => {  
            if (err) return callback(err);
      
            return callback(null, p);
          });
        });
      };


      const files = fs.readdirSync(dirPath);  
      if (files.length) 
        files.forEach(f => removePath(path.join(dirPath, f), printResult)); 
    } catch (err) {
      if (err) return console.log(err);
    }
  }

  static mkdirRecursive(dirPath) {
    const isExists = fs.existsSync(dirPath);
    if (!isExists) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  //문자열 특수문자 제거 시간값을 파일이름으로 만들때 문제발생함으로.
  static FilenameCheck(filename) {
    filename = filename.replace("~", "_");
    filename = filename.replace("?", "_");
    filename = filename.replace("^", "_");
    filename = filename.replace("&", "_");
    filename = filename.replace(":", "_");
    filename = filename.replace(":", "_");
    filename = filename.replace(":", "_");
    filename = filename.replace(":", "_");
    filename = filename.replace("#", "_");
    filename = filename.replace("$", "_");
    filename = filename.replace("&", "_");
    filename = filename.replace(" ", "_");

    return filename;
  }

  //파일을 읽어서 base64로 파싱함
  static ReadfileBase64(filename) {
    try {
      var rawdata = fs.readFileSync(filename);
    //  console.log('----------- ReadfileBase64(filename)', rawdata );
      return rawdata.toString("base64");
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  //base64 형태로 저장함
  static WritefileBase64(filename, base64str) {
    try {

      console.log('----------- WritefileBase64()', filename, base64str.length);

      let datas = Buffer.from(base64str, "base64");
      fs.writeFileSync(filename, datas);

    } catch (error) {
      console.log(error);

      return null;
    }
  }

  static EcodeBase64(mobjstr)
  {
    const datas = Buffer.from(mobjstr, "base64");
    return datas;
  }

  static DecodeBase64(mb64str)
  {
    let rawdata = mb64str.toString("base64");
    return rawdata;
  }

   //파일을 삭제함
   static Deletefile(filename) {
    try {
      
      fs.unlinkSync(filename);

      console.log("Deletefile  : " + filename);

    } catch (error) {
      console.log("Deletefile  : " + filename);
      console.log(error);
      return null;
    }
  }

};
