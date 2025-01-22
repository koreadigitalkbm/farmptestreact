

// post 응답메시지 
 class responseFarmscube{
    
    constructor()
    {
        
        this.status="success";
        this.device_id="";
        this.sensortime="";
        this.sensors=[];    /// 센서상태값
        this.imagetime="";
        this.imagepath="";
    }

}
module.exports = responseFarmscube;