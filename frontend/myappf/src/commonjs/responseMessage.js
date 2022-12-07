


 class responseMessage{
    
    constructor()
    {
        let today = new Date(); 
        this.datetime=today.toLocaleString();//응답된 날자+시간
        this.Sensors=[];    /// 센서상태값
        this.Outputs=[];    /// 구동기 상태값
        this.AutoStatus=[]; //자동제어 상태값
        this.AutoControls=[];
        this.retMessage= undefined;
        this.retParam= undefined;
        this.IsOK=false; ///요청을 정상적으로 처리했으면 true
    }

}
module.exports = responseMessage;