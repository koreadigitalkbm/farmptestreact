

//장비 기본 설정 파일
module.exports = class DeviceSystemconfig {

  static Clonbyjsonobj(mobj) {
    return Object.assign(new DeviceSystemconfig(), mobj);
  }

    constructor() {
      this.name = "unknown";
      this.deviceuniqid = "IFINIT";
      this.comport="COM26";
      this.password="1234";
      this.productname="foodjukebox"; // 시스템을 구별하는 명칭 :  foodjukebox,indoorfarm
      this.productmodel="KPC480"; //장비구별
      this.language="ko-KR";// 다국어 지원 때문에  백엔드에도 필요함.

    }
    
  };
  