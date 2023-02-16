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
          output: '/home/pi/kd/farmptestreact/common/ctestimage2.jpg',
          width: 640,
          height: 480,
          nopreview: true,
        });
        console.log('======================= 1 start pi-camera', '/home/pi/kd/farmptestreact/common/ctestimage2.jpg')
  
        return myCamera.snap()
          .then((data) => {    // data << 이미지 데이타가 아님... // 2023.02.16 이미지가 맞음... ㅋ
            console.log(" data : " + data.length);
            // let data_img = KDCommon.ReadfileBase64( '/home/pi/kd/farmptestreact/common/ctestimage2.jpg' );
            return data;
   
          })
          .catch((error) => {
            // Handle your error
            console.log("       ".bgMagenta, "Captureimage()", error);
            return null;
          });
    }

    
  };

