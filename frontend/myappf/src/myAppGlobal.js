


var myAppGlobal = {
    isinitalizeApp:false, // 초기화 되면  true  변경
    loginrole : null, // 
    issupervisor:false, //공장설정 가능 슈퍼바이저 
    islocal: false,  // 로컬, 원격
    isuseradmin: false, // 사용자 관리자계정(장비설정가능) 나머지 그냥 뷰어
    farmapi: undefined,
    logindeviceid: "",
    systeminformations:undefined,
    Autocontrolcfg: null,
    sessionid:0,//  중복로그인 방지 장비와는 한개 브라우져만 연결되도록  로그인시 램덤하게 생성
    langT:null,
    ncount:0
  }
  
export default myAppGlobal;
