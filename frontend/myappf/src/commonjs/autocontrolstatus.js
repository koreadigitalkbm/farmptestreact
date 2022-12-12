//자동제어시 변경되는 상태나 변수를 저장함.
const KDDefine = require("./kddefine");
module.exports = class AutoControlStatus {
  constructor(uniqid) {
    this.Uid=uniqid;
    //처음초기화상태
    this.State = KDDefine.AUTOStateType.AST_Off_finish;
  }
  ischangestatecheck(newstate) {
      //초기화상태이면 on이던 off 상태를 바로 변경함.
      if (this.State !== newstate) {
        this.State = newstate;
        if( this.State ==KDDefine.AUTOStateType.AST_IDLE )
        {
          return false;
        }
        return true;
      }
      return false;
    }
    
    
  
};
