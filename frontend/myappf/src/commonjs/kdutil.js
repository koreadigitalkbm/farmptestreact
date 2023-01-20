
//먼가 여러군데 사용될만한 함수를 모아보자
module.exports = class KDUtil {

  static GetActuatorinfofromid(actlist, aunqid)
  {
    for (const actd of actlist) {
        if( actd.UniqID ==aunqid)
        {
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



};
