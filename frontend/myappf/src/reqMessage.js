
export default class reqMessage {

  constructor(pid) {
    let today = new Date(); 
    this.datetime=today.toLocaleString();//요청된 날자+시간
    this.puniqid=pid;//제품 구별 ID 필수 IF0000  장비ID는 무조건 6자리 문자열로 지정 
  }
  reqType= undefined;
  loginID = undefined;
  loginPW = undefined;
  SessionID = 0;

  reqParam = undefined;

  getSensors = undefined;
  getOutputport = undefined;
  getAutoControl = undefined;
  getAutoControlstate = undefined;

  
  OutputManual = undefined;
  Autoconfigitem = undefined;
  Deviceconfigitem = undefined;
}
