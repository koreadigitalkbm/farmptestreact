

// post 응답메시지 
module.exports =  class responseFarmscube{
    
    constructor()
    {
        
        this.status="success";
        this.device_id="";
        this.sensortime="";
        this.sensors=[];    /// 센서상태값
        this.imagetime="";
        this.imagepath="";
    }

};
