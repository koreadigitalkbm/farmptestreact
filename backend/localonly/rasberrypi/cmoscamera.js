//cmos 카메라 관련



const KDCommon = require("../../kdcommon");


// ==============================================
// =======         original code          =======
// ==============================================
module.exports = class RasCamera {
    constructor() {
      
    }
  
      
    static async Captureimage() {
      
        const PiCamera = require("pi-camera");
       
        const myCamera = new PiCamera({
          mode: "photo",
          output: '/home/pi/kd/farmptestreact/common/ctestimage.jpg',
          width: 640,
          height: 480,
          nopreview: true,
        });
        console.log('======================= 1 start pi-camera', '/home/pi/kd/farmptestreact/common/ctestimage.jpg')
  
        return myCamera.snapDataUrl().then((data) => {    // data << 이미지 데이타가 아님... 
            console.log(" data : " + data);
            let data_img = KDCommon.ReadfileBase64(data);
            return data_img;
   
          })
          .catch((error) => {
            // Handle your error
            console.log("       ".bgMagenta, "Captureimage()", error);
            return null;
          });
    }

    
  };

