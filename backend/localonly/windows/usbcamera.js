//USB 카메라관련

const KDCommon = require("../../kdcommon");

module.exports = class USBCamera {
    constructor() {
      
    }
  
      
    static async Captureimage() {
      
        
        console.log("======================= USBCamera Captureimage start:");
  
        
        let lawimg=KDCommon.ReadfileBase64('../common/ctestimage.jpg');

        let promise = new Promise((resolve, reject) => {
            setTimeout(() => resolve(lawimg), 9000)
          });


          console.log("======================= USBCamera Captureimage  end : " +promise);
        return await promise;

    }

    
  };