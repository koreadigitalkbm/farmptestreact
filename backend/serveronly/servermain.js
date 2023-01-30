
// 클라우드 서버에서 구동되는 로직전부 


const ServerAPI = require("./serverapi");
const devicesystemlog = require("../devicesystemlog");

module.exports = class ServerMain {
  constructor(fversion) {
    
    this.systemlog = new devicesystemlog();
    this.mAPI = new ServerAPI(fversion,this);

  }

};










