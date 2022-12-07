
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

};
