//카메라 촬영 관련  인터페이스 클래스
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const KDCommon = require("../kdcommon");

const os = require("os");

module.exports = class CameraInterface {
  constructor() {}
  // 사진을 촬용하고  bin 데이터를 base64 인코딩해서 리턴함. ( 서버로  http 로 보내야함으로)
  static Captureimage() {
    if (os.platform() == "win32") {
      return KDCommon.ReadfileBase64("../common/ctestimage.jpg");
      
    } else {
      const PiCamera = require("pi-camera");
      const myCamera = new PiCamera({
        mode: "photo",
        output: "../../../common/ctestimage.jpg",
        width: 640,
        height: 480,
        nopreview: true,
      });

      myCamera
        .snap()
        .then((result) => {
          return KDCommon.ReadfileBase64("../common/ctestimage.jpg");
          // Your picture was captured
        })
        .catch((error) => {
          // Handle your error
          console.bgMagenta("       ", "Captureimage()", err);
          return null;
        });
    }
  }
};
