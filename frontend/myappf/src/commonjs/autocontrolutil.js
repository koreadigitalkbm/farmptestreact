
/// 자동제어 관련 
const AutoControlconfig = require("./autocontrolconfig");

const KDDefine = require("./kddefine");

module.exports = class AutoControlUtil{

  static CreateDefaultConfig(modelname)
  {
    let mcfglist=[];
    if(modelname == "KPC480")
    {
      let m1 = new AutoControlconfig();
      let m2 = new AutoControlconfig();
        m1.Actlist.push("N01C00T00");
      m2.Actlist.push("N01C01T00");
      mcfglist.push(m1);
      mcfglist.push(m2);

    }
    else{
      let m1 = new AutoControlconfig();
      let m2 = new AutoControlconfig();
        m1.Actlist.push("N01C00T00");
      m2.Actlist.push("N01C01T00");
      mcfglist.push(m1);
      mcfglist.push(m2);
    
    }

    return mcfglist;

  }

  static getTestconfig()
  {
    

    let m1 = new AutoControlconfig();

    m1.Name ="센서온도제어";
    m1.Actlist.push("N01C18T00");
    m1.Enb=true;
    m1.TEnb=false;

    m1.OnTime= AutoControlconfig.OnTimesecMAX;
    m1.OffTime=0;


    m1.STime=0;
    m1.ETime= 22*3600;

    m1.Senlist.push("S01C00T01");
    m1.TValue=22.0;
    m1.BValue=1;
    m1.Cdir =  KDDefine.SensorConditionType.SCT_DOWN;



    return m1;

  }
    
   
    
  };
  