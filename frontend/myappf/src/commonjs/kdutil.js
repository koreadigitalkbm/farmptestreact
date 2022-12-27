
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

  static GetOPIDRandom()
  {
    const rand_1_9999 = Math.floor(Math.random() * 10000) +1 + Math.floor(Math.random() * 100);
    return rand_1_9999;
  }

};
