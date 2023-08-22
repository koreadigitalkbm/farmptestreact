//cmos 카메라 관련



const KDCommon = require("../../kdcommon");


// ==============================================
// =======         original code          =======
// ==============================================
module.exports = class RasCamera {
    constructor() {
      
    }
  
      
static async Captureimage(miskpc480, isusbwecam) {

if(isusbwecam== true)
{
  let shell = require('shelljs');

  console.log(" usb webcam  mode start ");

  let _cmd = `fswebcam -r 1280*960 --no-banner /home/pi/kd/farmptestreact/frontend/myappf/public/usbcamimage.jpg`
        if (shell.exec(`${ _cmd }`).code === 0) {
            console.log('done !!! get image',  );
        }
        else {
            console.log('failed !!! get image',  );
        }


  await KDCommon.delay(5000);

  console.log(" usb webcam  mode wait 5sec.. ");

  let data_img = KDCommon.ReadfileBase64( '/home/pi/kd/farmptestreact/frontend/myappf/public/usbcamimage.jpg' );

  if(data_img !=null)
  {
    if( data_img.length >1000)
    {
      console.log(" usb data_img length:  " +data_img.length );

      return data_img;
    }
  }
  return null;

}
else{


  

  console.log(" cmos camera mode ");


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
            height: 2464,
            quality : 70,
            shutter : 4000,
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
            console.log("       ".bgMagenta, "Capturimage()", error);
            return null;
          });
    }
  }
    
  };

