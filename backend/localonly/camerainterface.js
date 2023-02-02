//카메라 촬영 관련  인터페이스 클래스
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const KDCommon = require("../kdcommon");




module.exports = class CameraInterface {
  constructor() {

  }
  // 사진을 촬용하고  bin 데이터를 base64 인코딩해서 리턴함. ( 서버로  http 로 보내야함으로)
  static Captureimage()
  {
    return KDCommon.ReadfileBase64("../common/ctestimage.jpg");
  }

};
