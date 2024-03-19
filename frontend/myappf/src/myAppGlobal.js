


var myAppGlobal = {
    
    loginrole : null, // 
    issupervisor:false, //공장설정 가능 슈퍼바이저 
    islocal: false,  // 로컬, 원격
    loginswpw: "",  // 로그인 암호 암호 변경시사용
    loginswid: "",  // 로그인 id 암호 변경시사용
    isuseradmin: false, // 사용자 관리자계정(장비설정가능) 나머지 그냥 뷰어
    farmapi: undefined,
    logindeviceid: "",
    systeminformations:undefined,
    Autocontrolcfg: null,
    sessionid:0,//  중복로그인 방지 장비와는 한개 브라우져만 연결되도록  로그인시 램덤하게 생성
    langT:null,
    language:null,
    dashboardimagefileurl:"image/noimage.png",
    dashboardlasteventtime: 1,
    dashboardlastsensortime: 1,
    gsensorlist:[],  //센서 별칭
    gactuaotrslist:[], // 구동기 별칭
    ncount:0,
    isdatamaininit:false, // datamain 페이지 초기화 상태를 표시
    isdashboardpageinit:false // 대시보드 초기화 상태를 표시 로그아웃일때 변경후 다시 로그인할때 내부 변수들을 초기화함. 기존데이터남아있지 않도록
  }
  
export default myAppGlobal;
