
//먼가 여러군데 사용될만한 함수를 모아보자

const KDDefine = require("./kddefine");
const ActuatorStatus = require("./actuatorstatus");

module.exports = class KDUtil {

  
  static GetActuatorinfofromid(actlist, aunqid, myGlobal)
  {
    for (const actd of actlist) {
        if( actd.UniqID ===aunqid)
        {
          const nameid="LT_ACTDEVICE_"+ actd.Nid;
          const statestr= myGlobal.langT(nameid);
          actd.Name = statestr;
          return actd;
        }
      
    }
    return null;
  }
//제어용 OPID를 램덤하게 생성 0이면안됨
  static GetOPIDRandom()
  {
    const rand_1_9999 = Math.floor(Math.random() * 10000) +1 + Math.floor(Math.random() * 100);
    return rand_1_9999;
  }

  static GetRandom10()
  {
    const rand_1_9999 = Math.floor(Math.random() * 10000000000) +1 + Math.floor(Math.random() * 10000);
    return rand_1_9999;
  }

  static secToTime(dayseconds) {
    if (dayseconds >= 24 * 3600) {
      return "23:59";
    }
    let hour = Math.floor(dayseconds / 3600);
    let min = Math.floor((dayseconds - hour * 3600) / 60);
    if (hour < 10) hour = "0" + hour;
    if (min < 10) min = "0" + min;
    console.log("secToTime : " + (hour + ":" + min));
    return hour + ":" + min;
  }

  static timeTosec(timestr) {
    const [hours, minutes] = timestr.split(":");
    return Number(hours * 3600 + minutes * 60);
  }

  static Stringformat()
  {
    
    let formatted = arguments[0];
    for (let arg=1;arg<arguments.length;arg++) 
    {
        formatted = formatted.replace("{" + (arg-1) + "}", arguments[arg]);
    }
    return formatted;
  }

  /// 이벤트 내용을 문자열로 변경함
  static EventToString(mEvent,myGlobal)
  {
    
    
    let strevent;
    const today = new Date(mEvent.EDate);
    strevent = today.toLocaleString() +": ";
    switch(mEvent.EType)
    {
      case KDDefine.EVENTType.EVT_ACTUATOR:
        let actinfo = KDUtil.GetActuatorinfofromid(myGlobal.systeminformations.Actuators, mEvent.EParam.actid,myGlobal);

        const statestr= myGlobal.langT(ActuatorStatus.stateToStringID(mEvent.EParam.state));
        strevent=strevent+ KDUtil.Stringformat(myGlobal.langT("LT_ACTUATOR_EVENT"),actinfo.Name,statestr);

        break;

      default:
                
        strevent=strevent+ KDUtil.Stringformat(myGlobal.langT("LT_UNKNOWN_EVENT"),mEvent.EType);

        break;

    }
    return strevent;


  }




};
