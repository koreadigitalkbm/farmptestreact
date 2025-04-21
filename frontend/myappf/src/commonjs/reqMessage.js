//데이터요청 post message  리얼타임디비를 사용하니 요금발생함으로  간단한 구조로 변경하자.
class reqMessage {

  constructor(pid, reqtype) {
    const d = new Date();
    this.Time = d.toISOString();
    this.uqid=pid;//제품 구별 ID 필수 IF0000  장비ID는 무조건 6자리 문자열로 지정 
    this.reqType= reqtype; // 필수
    this.reqParam = undefined;
    //console.log("reqMessage  reqType: " + this.reqType + ", uqid: " + this.uqid);
  }
  
}
module.exports = reqMessage;