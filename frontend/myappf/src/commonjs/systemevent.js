//구동기 기본 정보
const KDDefine = require("./kddefine");
const KDUtil = require("./kdutil");
module.exports = class SystemEvent {
  static Clonbyjsonobj(mobj) {
    return Object.assign(new SystemEvent(), mobj);
  }

  constructor(metype, mparams) {
    this.EDate = Date.now();
    this.EType = metype; //
    this.EParam = mparams; //이벤트 내용
   }

   eventtostring()
   {
    let strevent;

    const today = new Date(this.EDate);
    strevent = today.toLocaleString() +": ";
    switch(this.EType)
    {
      default:
        strevent=strevent+ this.EParam;
        break;

    }

    return strevent;

   }

};
