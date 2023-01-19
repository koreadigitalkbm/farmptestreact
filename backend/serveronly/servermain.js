
// 클라우드 서버에서 구동되는 로직전부 


const ServerAPI = require("./serverapi");


module.exports = class ServerMain {
  constructor(fversion) {
    
    this.mAPI = new ServerAPI(this);

  }

};










