const fs = require('fs');

module.exports = class KDCommon {
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

};
