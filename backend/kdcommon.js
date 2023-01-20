const fs = require("fs");

//백엔드에서 공통으로 사용되는 함수들
module.exports = class KDCommon {
  static systemconfigfilename = "../common/local_files/systemconfig.json";
  static autocontrolconfigfilename = "../common/local_files/autocontrolconfig.json";
  static actuatorconfigfilename = "../common/local_files/actuatorconfig.json";
  static actuatorconfigfilename_kpc480 = "../common/local_files/actuatorconfig_kpc480.json";
  static actuatorconfigfilename_kpc200 = "../common/local_files/actuatorconfig_kpc200.json";
  static actuatorconfigfilename_VFC3300 = "../common/local_files/actuatorconfig_VFC3300.json";

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
  static getCurrentTotalsec() {
    const clocknow = new Date();
    const totalsec = clocknow.getHours() * 3600 + clocknow.getMinutes() * 60 + clocknow.getSeconds();
    return totalsec;
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

    return filename;
  }

  //파일을 읽어서 base64로 파싱함
  static ReadfileBase64(filename) {
    try {
      var rawdata = fs.readFileSync(filename);
      return rawdata.toString("base64");
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  //base64 형태로 저장함
  static WritefileBase64(filename, base64str) {
    try {
      let datas = Buffer.from(base64str, "base64");
      fs.writeFileSync(filename, datas);
    } catch (error) {
      console.log(error);

      return null;
    }
  }
};
