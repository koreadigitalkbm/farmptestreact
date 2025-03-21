//먼가 여러군데 사용될만한 함수를 모아보자

const KDDefine = require("./kddefine");
const ActuatorStatus = require("./actuatorstatus");

module.exports = class KDUtil {
  static GetAutoconfigfromid(aunqid, myGlobal) {
    const autolist = myGlobal.Autocontrolcfg;
    if (autolist == null) {
      return null;
    }

    for (const mitem of autolist) {
      if (mitem.Uid === aunqid) {
        return mitem;
      }
    }
    return null;
  }
  //

  static GetActuatorinfofromid(actlist, aunqid, myGlobal, isalias=true) {
    for (const actd of actlist) {
      if (actd.UniqID === aunqid) {
        const nameid = "LT_ACTDEVICE_" + actd.Nid;

      //  console.log("GetActuatorinfofromid :  nameid : "+nameid + "  actd.Nid:"+ actd.Nid);

        const statestr = myGlobal.langT(nameid);
        actd.Name = statestr;
        if(isalias === true)
        {
          const maliasname = KDUtil.getAlias(actd.UniqID, myGlobal);
          if (maliasname != null) {
            actd.Name = maliasname;
          }
        }
        

        return actd;
      }
    }
    return null;
  }
  //제어용 OPID를 램덤하게 생성 0이면안됨
  static GetOPIDRandom() {
    const rand_1_9999 = Math.floor(Math.random() * 10000) + 1 + Math.floor(Math.random() * 100);
    return rand_1_9999;
  }

  static GetRandom10() {
    const rand_1_9999 = Math.floor(Math.random() * 10000000000) + 1 + Math.floor(Math.random() * 10000);
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
    return hour + ":" + min;
  }

  static timeTosec(timestr) {
    const [hours, minutes] = timestr.split(":");
    return Number(hours * 3600 + minutes * 60);
  }

  static Stringformat() {
    let formatted = arguments[0];
    for (let arg = 1; arg < arguments.length; arg++) {
      formatted = formatted.replace("{" + (arg - 1) + "}", arguments[arg]);
    }
    return formatted;
  }

  /// 이벤트 내용을 문자열로 변경함
  static EventToString(mEvent, myGlobal, isonlycontents = false) {
    let strevent;

    if (isonlycontents == true) {
      strevent = "";
    } else {
      const today = new Date(mEvent.EDate);
      console.log("EventToString :  today : "+today + "  mEvent.EDate:"+ mEvent.EDate)
      strevent = today.toTimeString() + ": ";
    }

    switch (mEvent.EType) {
      case KDDefine.EVENTType.EVT_AUTOCONTROL:
        if (myGlobal.Autocontrolcfg != null) {
          let autoinfo = KDUtil.GetAutoconfigfromid(mEvent.EParam.autoid, myGlobal);
          if (autoinfo != null) {
            const statestr = myGlobal.langT(ActuatorStatus.stateToStringID(mEvent.EParam.state));

            switch (mEvent.EParam.state) {
              case KDDefine.AUTOStateType.AST_AutoToMa:
                strevent = strevent + KDUtil.Stringformat(myGlobal.langT("LT_AUTO_EVENT_ATM"), autoinfo.Name, statestr);
                break;
              case KDDefine.AUTOStateType.AST_MaToAuto:
                strevent = strevent + KDUtil.Stringformat(myGlobal.langT("LT_AUTO_EVENT_MTA"), autoinfo.Name, statestr);
                break;
              case KDDefine.AUTOStateType.AST_AutoChange:
                strevent = strevent + KDUtil.Stringformat(myGlobal.langT("LT_AUTO_EVENT_CHANGE"), autoinfo.Name, statestr);
                break;

              default:
                strevent = strevent + KDUtil.Stringformat(myGlobal.langT("LT_AUTO_EVENT_BASIC"), autoinfo.Name, statestr);
                break;
            }
          }
        }

        break;

      case KDDefine.EVENTType.EVT_SYSTEM:
        {
          const strid = "LT_SYSTEM_EVENT_" + mEvent.EParam.ecode;

          if (mEvent.EParam.ecode == KDDefine.SysEventCode.SEC_Message) {
            strevent = strevent + mEvent.EParam.p1;
          } else if (mEvent.EParam.ecode == KDDefine.SysEventCode.SEC_Sensor_error) {
            strevent = strevent + KDUtil.Stringformat(myGlobal.langT(strid), mEvent.EParam.p1);
          } else {
            strevent = strevent + myGlobal.langT(strid);
          }
        }
        break;
      case KDDefine.EVENTType.EVT_ACTUATOR:
        let actinfo = KDUtil.GetActuatorinfofromid(myGlobal.systeminformations.Actuators, mEvent.EParam.actid, myGlobal);
        if (actinfo != null) {
          const statestr = myGlobal.langT(ActuatorStatus.stateToStringID(mEvent.EParam.state));
          strevent = strevent + KDUtil.Stringformat(myGlobal.langT("LT_ACTUATOR_EVENT"), actinfo.Name, statestr);
        }
        break;

      default:
        strevent = strevent + KDUtil.Stringformat(myGlobal.langT("LT_UNKNOWN_EVENT"), mEvent.EType);
        break;
    }
    return strevent;
  }

  //지원언어리턴 지원하지 않으면 영어로
  static isSupportLanguage(mlang) {
    if (mlang == "ko-KR" || mlang == "en-US") {
      return mlang;
    }

    return "en-US";
  }

  static getDatefromformatstring(mdate)
  {
    const d = new Date(mdate);
    return d;
  }


  static dateTostringshottime(mdate) {
    const d = new Date(mdate);
    return d.getHours() + ":" + d.getMinutes();
  }

  static dateTostringshotdate(mdate) {
    const d = new Date(mdate);
    return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes();
  }

  static dateTostringforme(mdate, isdate, istime) {
    let timestr = "";
    if (mdate != null) {
      const d = new Date(mdate);
      console.log("-------------------------dateTostringforme-------mdate:" + mdate);

      const date = d.toISOString().split("T")[0];
      const time = d.toTimeString().split(" ")[0];

      if (isdate == true) {
        timestr = date;
      }
      if (istime == true) {
        timestr = timestr + " " + time;
      }
    }

    return timestr;
  }

  static getAlias(mid, myGlobal) {
    if (myGlobal.systeminformations.Alias != null) {
      for (let i = 0; i < myGlobal.systeminformations.Alias.length; i++) {
        if (myGlobal.systeminformations.Alias[i].id === mid) {
          if (myGlobal.systeminformations.Alias[i].name.length >= 1) {
            return myGlobal.systeminformations.Alias[i].name;
          }
        }
      }
    }
    return null;
  }

  static setAlias(mid, newname, myGlobal) {
    if (myGlobal.systeminformations.Alias != null) {
      for (let i = 0; i < myGlobal.systeminformations.Alias.length; i++) {
        if (myGlobal.systeminformations.Alias[i].id === mid) {
          myGlobal.systeminformations.Alias[i].name = newname;
          return null;
        }
      }
      let newid={
        id:mid,
        name:newname,
      }
      myGlobal.systeminformations.Alias.push(newid);


    }
    return null;
  }
};
