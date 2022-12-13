/// 자동제어 관련 API 모음
const AutoControlconfig = require("./autocontrolconfig");
const KDDefine = require("./kddefine");

module.exports = class AutoControlUtil {
  static GetActuatorbyUid(mActList, mUid) {
    for (const ma of mActList) {
      if (ma.UniqID == mUid) {
        return ma;
      }
    }

    return null;
  }

  static IsIncludeTime(starttime, endtime, currenttime) {
    //시작시간이 더크면 자정포함임.
    if (starttime > endtime) {
      if (currenttime >= starttime || currenttime <= endtime) {
        return true;
      }
    } else {
      if (currenttime >= starttime && currenttime <= endtime) {
        return true;
      }
    }
  }

  static CreateDefaultConfig(modelname) {
    let mcfglist = [];

    //모델별로 디폴트 자동제어 설정
    if (modelname == "KPC480") {
      //////////////////////////온도제어
      let m1 = new AutoControlconfig();
      m1.Name = "센서온도제어";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = true;
      m1.AType = KDDefine.AUTOType.ACM_SENSOR_DAY_NIGHT;
      m1.Cat = KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX; //  자동제어 분류
      m1.Actlist.push("N01C18T00"); ///히터 릴레이 장비
      m1.Actlist.push("N01C19T00"); ///쿨러 릴레이 장비
      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.STime = 8 * 3600;
      m1.ETime = 18 * 3600;
      m1.Senlist.push("S01C00T01"); /// 온도센서 지정
      m1.DTValue = 24.0;
      m1.NTValue = 20.0;
      m1.BValue = 1;
      m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
      mcfglist.push(m1);

      //////////////////관수제어
      m1 = new AutoControlconfig();
      m1.Name = "관수제어(타이머)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = true;
      m1.AType = KDDefine.AUTOType.ACM_TIMER_DAY_NIGHT;
      m1.Cat = KDDefine.AUTOCategory.ATC_WATER; //  자동제어 분류
      m1.Actlist.push("N01C17T00"); ///관수 릴레이 장비
      m1.DOnTime = 30;
      m1.DOffTime = 120;
      m1.NOnTime = 10;
      m1.NOffTime = 120;
      m1.STime = 8 * 3600;
      m1.ETime = 20 * 3600;
      m1.TValue = 0;
      m1.BValue = 0;
      m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
      mcfglist.push(m1);

      ///LED 제어
      m1 = new AutoControlconfig();
      m1.Name = "광량제어(3LED)";
      m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
      m1.Enb = true;
      m1.AType = KDDefine.AUTOType.ACM_TIMER_ONLY_DAY;
      m1.Cat = KDDefine.AUTOCategory.ACT_LED_MULTI_FOR_FJBOX; //  자동제어 분류
      m1.Actlist.push("N01C24T02"); ///
      m1.Actlist.push("N01C25T02"); ///
      m1.Actlist.push("N01C26T02"); ///
      m1.DOnTime = AutoControlconfig.OnTimesecMAX;
      m1.DOffTime = 0;
      m1.NOnTime = 0;
      m1.NOffTime = 0;
      m1.STime = 8 * 3600;
      m1.ETime = 15 * 3600 + 1200;
      m1.DTValue = 0;
      m1.BValue = 0;
      m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;
      m1.Params.push(65);
      m1.Params.push(14);
      m1.Params.push(99);

    } else {
      let m1 = new AutoControlconfig();
      let m2 = new AutoControlconfig();
      m1.Actlist.push("N01C00T00");
      m2.Actlist.push("N01C01T00");
      mcfglist.push(m1);
      mcfglist.push(m2);
    }

    return mcfglist;
  }

  static getTestconfig() {
    let m1 = new AutoControlconfig();

    m1.Name = "광량제어(3LED)";
    m1.Pri = KDDefine.AUTOPriority.AP_NORMAL;
    m1.Enb = true;
    m1.AType = KDDefine.AUTOType.ACM_TIMER_ONLY_DAY;

    m1.Cat = KDDefine.AUTOCategory.ACT_LED_MULTI_FOR_FJBOX; //  자동제어 분류
    m1.Actlist.push("N01C24T02"); ///
    m1.Actlist.push("N01C25T02"); ///
    m1.Actlist.push("N01C26T02"); ///

    m1.DOnTime = AutoControlconfig.OnTimesecMAX;
    m1.DOffTime = 0;
    m1.NOnTime = 0;
    m1.NOffTime = 0;

    m1.STime = 8 * 3600;
    m1.ETime = 15 * 3600 + 1200;
    m1.DTValue = 0;
    m1.BValue = 0;
    m1.Cdir = KDDefine.SensorConditionType.SCT_DOWN;

    m1.Params.push(65);
    m1.Params.push(14);
    m1.Params.push(99);

    return m1;
  }
};
