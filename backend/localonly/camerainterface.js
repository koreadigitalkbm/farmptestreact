//카메라 촬영 관련  인터페이스 클래스
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const KDCommon = require("../kdcommon");

const os = require("os");


const RasCamera =require("./rasberrypi/cmoscamera");
const USBCamera = require("./windows/usbcamera");



module.exports = class CameraInterface {
  constructor() {
   
  }
  

  static  async CaptureStillimage(miskpc480, cameratype) {

    let data_img;
    if (os.platform() === "win32") {
//      data_img = KDCommon.ReadfileBase64('../common/ctestimage.jpg')
        data_img = await USBCamera.Captureimage();


    } else {

      let isusbwecam=false;
      if(cameratype == KDDefine.CameraType.CT_USB)
      {
        isusbwecam=true;
      }

      data_img = await RasCamera.Captureimage(miskpc480, isusbwecam);

      

    }

    //console.log('----------- CameraInterface Capturimage end', 'size is : ', data_img.length );

    return data_img;
    

  }


};


