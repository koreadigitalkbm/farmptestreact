//구동기 기본 정보
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");


module.exports = class SystemEvent {
  static Clonbyjsonobj(mobj) {
    return Object.assign(new SystemEvent(0,0), mobj);
  }

  constructor(metype, mparams) {
    this.EDate = Date.now();
    this.EType = metype; //
    this.EParam = mparams; //이벤트 내용 json 포멧으로 
//    console.log("SystemEvent   EType: " + this.EType + " date:"+ this.EDate);

   }

   //이벤트가 추가되면   kdutil EventToString 함수도 추가 
   static createDevSystemEvent(mcode,p1,p2)
   {
     let params={"ecode": mcode,"p1": p1,"p2": p2};
     
     return new SystemEvent(KDDefine.EVENTType.EVT_SYSTEM, params);
   }
   static createActuatorEvent(mactid,mstate)
   {
     let params={
                "actid": mactid,
                "state": mstate
                };

     return new SystemEvent(KDDefine.EVENTType.EVT_ACTUATOR, params);
   }

   static createAutoControlEvent(autoid,mstate)
   {
     let params={
                "autoid": autoid,
                "state": mstate
                };

     return new SystemEvent(KDDefine.EVENTType.EVT_AUTOCONTROL, params);
   }

   static eparamEcodeb64(mparaobj)
   {

    let objJsonStr = JSON.stringify(mparaobj);
    let objJsonB64 = Buffer.from(objJsonStr).toString("base64");
//    console.log("eparamEcodeb64 : " + objJsonB64);

    return objJsonB64;

   }

   static createEventbyDBObject(dbobj)
   {
     const etype= dbobj.etype;
     const etime= dbobj.dtime;
     const jsonString = Buffer.from(dbobj.edatas,'base64').toString();
     const eparam= JSON.parse(jsonString);
     let newevt= new SystemEvent(etype, params);
     newevt.EDate=etime;
     return newevt;

   }

   

};
