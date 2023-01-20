//카메라 촬영 관련  인터페이스 클래스
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const KDCommon = require("../kdcommon");




module.exports = class CameraInterface {
  constructor() {

  }
  static Captureimage()
  {
    return KDCommon.ReadfileBase64("../common/ctestimage.jpg");
  }

};
