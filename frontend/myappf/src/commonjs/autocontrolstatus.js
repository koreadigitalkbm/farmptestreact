//자동제어시 변경되는 상태나 변수를 저장함.
module.exports = class AutoControlStatus {
  constructor(uniqid) {
    this.autouniqid=uniqid;
    //처음초기화상태
    this.onoffstate = "init";
  }
  ischangestatecheck(newstate) {
      //초기화상태이면 on이던 off 상태를 바로 변경함.
      if (this.onoffstate !== newstate) {
        this.onoffstate = newstate;
        return true;
      }
      return false;
    }
    
    
  
};
