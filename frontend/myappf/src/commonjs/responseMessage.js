

// post 응답메시지 
 class responseMessage{
    
    constructor()
    {
        const d = new Date();
        this.Time=d.toLocaleTimeString();
        this.devID="";
        this.reqType="";
        this.Sensors=[];    /// 센서상태값
        this.Outputs=[];    /// 구동기 상태값
        this.AutoStatus=[]; //자동제어 상태값
        this.retMessage= undefined; // 응답 메시지 문자열
        this.retParam= undefined;   //응답 객체 여러가지 들....
        this.IsOK=false; ///요청을 정상적으로 처리했으면 true
    }

}
module.exports = responseMessage;