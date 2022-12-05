

//장비 기본 설정 파일
module.exports = class DeviceSystemconfig {
    constructor() {
      this.name = "팜스큐브시스템설정";
      this.deviceuniqid = "IFINIT";
      this.comport="COM26";
      this.password="1234";
      this.productname=""; // 시스템을 구별하는 명칭 :  foodjukebox,indoorfarm
      this.productmodel="KPC480"; //장비규별

    }
    
  };
  