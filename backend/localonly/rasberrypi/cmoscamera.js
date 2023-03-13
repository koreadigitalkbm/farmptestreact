//cmos 카메라 관련



const KDCommon = require("../../kdcommon");


// ==============================================
// =======         original code          =======
// ==============================================
module.exports = class RasCamera {
    constructor() {
      
    }
  
      
    static async Captureimage(miskpc480) {
      
        const PiCamera = require("pi-camera");
       //kbm 카메라 해상도 조정 
        let myCamera = new PiCamera({
          mode: "photo",
          output: '/home/pi/kd/farmptestreact/common/ctestimage2.jpg',
          width: 1600,
          height: 1200,
          quality : 70,
          // width: 3280,
          // height: 2468,
          // width: 3280,
          // height: 2468,
          shutter : 3000,
          nopreview: true,
        });
        if(miskpc480 ==true)
        {
          myCamera = new PiCamera({
            mode: "photo",
            output: '/home/pi/kd/farmptestreact/common/ctestimage2.jpg',
            width: 3280,
            height: 2468,
            quality : 70,
            shutter : 1000,
            nopreview: true,
          });
        }
        console.log('======================= 1 start pi-camera', '/home/pi/kd/farmptestreact/common/ctestimage2.jpg')
  
        return await myCamera.snapDataUrl()
          .then((data) => {    // data << 이미지 데이타가 아님... 
            //let data_img = KDCommon.ReadfileBase64( '/home/pi/kd/farmptestreact/common/ctestimage2.jpg' );
            //console.log(" data : " + data_img.length);
            
            //"data:image/jpg;base64," 문자열 제거
            
            return  data.substring(22);
   
          })
          .catch((error) => {
            // Handle your error
            console.log("       ".bgMagenta, "Captureimage()", error);
            return null;
          });
    }

    
  };

