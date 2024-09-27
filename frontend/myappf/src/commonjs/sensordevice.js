
const  KDDefine= require("./kddefine");
const  KDUtil = require("./kdutil");
const SensorCompact = require("./sensorcompact");


    module.exports = class Sensordevice{
        
    
        constructor(mcompactsensor, myGlobal=null)  {
                
            this.Name = "sensor";
            this.OName = "sensor"; //오리지널 네임 별칭아님
            this.ValueUnit = " ";
            this.SignificantDigit = 3;

            this.nodeID = Sensordevice.Getnodeid(mcompactsensor.Uid);
            this.channel = Sensordevice.Getchannel(mcompactsensor.Uid);
            this.Sensortype = Sensordevice.Getsensortype(mcompactsensor.Uid);


            this.UniqID = mcompactsensor.Uid; // 센서를 구별하는 고유ID  센서노드번호와 하드웨어 채널  센서타입정보로 생성한다. S11C1T23
            this.status =0;
            this.errorcount=0;

            switch (this.Sensortype) {
                case KDDefine.KDSensorTypeEnum.SUT_Temperature: this.ValueUnit = "℃"; this.Name = "온도"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_Humidity: this.ValueUnit = "%"; this.Name = "습도"; this.SignificantDigit = 0; break;
                case KDDefine.KDSensorTypeEnum.SUT_SoilTemperature: this.ValueUnit = "℃"; this.Name = "토양온도"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_SoilMoisture: this.ValueUnit = "%vol."; this.Name = "토양함수율"; this.SignificantDigit = 1; break;
    
                case KDDefine.KDSensorTypeEnum.SUT_SoilEC: this.ValueUnit = "dS/m"; this.Name = "토양EC"; this.SignificantDigit = 2; break;
                case KDDefine.KDSensorTypeEnum.SUT_CO2: this.ValueUnit = "ppm"; this.Name = "이산화탄소"; this.SignificantDigit = 0; break;
                
    
                case KDDefine.KDSensorTypeEnum.SUT_WTemperature: this.ValueUnit = "℃"; this.Name = "배지온도"; this.SignificantDigit = 1; break;
    
    
                case KDDefine.KDSensorTypeEnum.SUT_SoraRadiation: this.ValueUnit = "W/m2"; this.Name = "일사"; this.SignificantDigit = 1; break;
    
                case KDDefine.KDSensorTypeEnum.SUT_WINDSPEED: this.ValueUnit = "m/s"; this.Name = "풍속"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_WINDVANE:  this.ValueUnit = "°"; this.Name = "풍향"; this.SignificantDigit = 1; break;
    
    
                
                case KDDefine.KDSensorTypeEnum.SUT_BAROMETER: this.ValueUnit = "hPa"; this.Name = "대기압"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_PRESSURE: this.ValueUnit = "hPa"; this.Name = "압력"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_RAINGUAGE: this.ValueUnit = "mm"; this.Name = "강우량"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_RAINDETECTOR: this.ValueUnit = " "; this.Name = "강우감지"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_UV: this.ValueUnit = ""; this.Name = "UV"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_PE300_PH: this.ValueUnit = " "; this.Name = "pH"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_PE300_EC: this.ValueUnit = "dS/m"; this.Name = "EC"; this.SignificantDigit = 2; break;
                case KDDefine.KDSensorTypeEnum.SUT_PE300_TEMP: this.ValueUnit = "℃"; this.Name = "양액온도"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_CO1: this.ValueUnit = "ppm"; this.Name = "일산화탄소"; this.SignificantDigit = 1; break;
                
                
                case KDDefine.KDSensorTypeEnum.SUT_O2: this.ValueUnit = "%"; this.Name = "산소"; this.SignificantDigit = 2; break;
                case KDDefine.KDSensorTypeEnum.SUT_LIGHT: this.ValueUnit = "Lux"; this.Name = "조도"; this.SignificantDigit = 0; break;
                case KDDefine.KDSensorTypeEnum.SUT_COLOR_RED: this.ValueUnit = " "; this.Name = "RED"; this.SignificantDigit = 0; break;
                case KDDefine.KDSensorTypeEnum.SUT_COLOR_GREEN: this.ValueUnit = " "; this.Name = "GREEN"; this.SignificantDigit = 0; break;
                case KDDefine.KDSensorTypeEnum.SUT_COLOR_BLUE: this.ValueUnit = " "; this.Name = "BLUE"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_AMMONIA: this.ValueUnit = "ppm"; this.Name = "암모니아"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_FLOWMETER: this.ValueUnit = "L/min"; this.Name = "유량"; this.SignificantDigit = 3; break;
                case KDDefine.KDSensorTypeEnum.SUT_FLOWMETER_TOTAL: this.ValueUnit = "L"; this.Name = "적산유량"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_BATTRY: this.ValueUnit = "%"; this.Name = "베터리"; this.SignificantDigit = 1; break;
                
                case KDDefine.KDSensorTypeEnum.SUT_WEIGHT_KG: this.ValueUnit = "kg"; this.Name = "무게"; this.SignificantDigit = 3; break;
                case KDDefine.KDSensorTypeEnum.SUT_WATER_MM: this.ValueUnit = "mm"; this.Name = "수위"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_DO_MG: this.ValueUnit = "mg/L"; this.Name = "용존산소량"; this.SignificantDigit = 2; break;
                case KDDefine.KDSensorTypeEnum.SUT_SoilBulkEC: this.ValueUnit = "dS/m"; this.Name = "벌크EC"; this.SignificantDigit = 2; break;
                case KDDefine.KDSensorTypeEnum.SUT_Counter: this.ValueUnit = "N"; this.Name = "계수기"; this.SignificantDigit = 0; break;
                case KDDefine.KDSensorTypeEnum.SUT_H2S: this.ValueUnit = "ppm"; this.Name = "황화수소"; this.SignificantDigit = 2; break;
                case KDDefine.KDSensorTypeEnum.SUT_PM25: this.ValueUnit = "ug"; this.Name = "초미세먼지"; this.SignificantDigit = 2; break;
                case KDDefine.KDSensorTypeEnum.SUT_PM10: this.ValueUnit = "ug"; this.Name = "미세먼지"; this.SignificantDigit = 2; break;
                case KDDefine.KDSensorTypeEnum.SUT_C1H4: this.ValueUnit = "ppm"; this.Name = "메탄"; this.SignificantDigit = 2; break;
                case KDDefine.KDSensorTypeEnum.SUT_C2H6: this.ValueUnit = "ppm"; this.Name = "에탄"; this.SignificantDigit = 2; break;
                case KDDefine.KDSensorTypeEnum.SUT_C3H6: this.ValueUnit = "ppm"; this.Name = "프로판"; this.SignificantDigit = 2; break;
                case KDDefine.KDSensorTypeEnum.SUT_SOLARMJ: this.ValueUnit = "J/cm2"; this.Name = "누적일사량"; this.SignificantDigit = 3; break;
                case KDDefine.KDSensorTypeEnum.SUT_DEWPOINT: this.ValueUnit = "℃"; this.Name = "이슬점"; this.SignificantDigit = 1; break;

                case KDDefine.KDSensorTypeEnum.SUT_FIRE_DETECTOR: this.ValueUnit = "N"; this.Name = "수위감지기"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_HUMIDITY_DEFICIT: this.ValueUnit = "g/m3"; this.Name = "수분부족분"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_DIFF_PRESSURE: this.ValueUnit = "Pa"; this.Name = "차압"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_QUANTUM_MOL: this.ValueUnit = "umol"; this.Name = "광양자"; this.SignificantDigit = 1; break;
                case KDDefine.KDSensorTypeEnum.SUT_SALINITY: this.ValueUnit = "ppt"; this.Name = "염도"; this.SignificantDigit = 1; break;


                default:
                    this.ValueUnit = " "; 
                    this.Name = "신규센서(" + this.Sensortype +")"; 
                    this.SignificantDigit = 1; 
                    break;
    
            }

            // 센서종류로 이름 리턴 다국어 지원

            this.OName =this.Name ;
            if(myGlobal !=null)
            {
                const tid="LT_SNAME_"+this.Sensortype;
                const statestr= myGlobal.langT(tid);
             if(statestr !=null)
             {
                this.Name = statestr;
                this.OName =this.Name ;
             }

             const maliasname=KDUtil.getAlias(this.UniqID,myGlobal);
             if(maliasname !=null)
             {
                this.Name = maliasname;
             }
 
            }

            this.Setupdatevalue(mcompactsensor.Val);
    
        }


    //  console.log("SensorDevice  : " + this.value );

    static createSensor(stype, nodeid, channel ,  myGlobal=null)
    {
        const sensrcode = ((channel<<8)&0xFF00) +  (stype&0xFF);

        let cmps= new SensorCompact(nodeid,sensrcode,0);
        return new Sensordevice(cmps,myGlobal);
    }

    //센서값을 문자열로표시 표시
    GetValuestring(isWithname, isWithunit){
        let strvalue = "";
        if (isWithname === true) {
            strvalue += this.Name + " ";
        }
        if(this.value !=null)
        {
            strvalue += this.valuestring ;
        }

        if (isWithunit === true) {
            strvalue += " " + this.ValueUnit;
        }
        return strvalue;
    }
   

    Setupdatevalue(newvalue)
    {

        // 센서 값이 null 오는 경우가 있음. 그러면 그냥 0으로 
        if(newvalue ==null)
        {
            this.value =0;
        }
        else{
            this.value =newvalue;
        }
        
        this.errorcount=0;
        this.valuestring = this.value.toFixed(this.SignificantDigit);
    }
    static Getchannel(uniqid)
    {
        let ch=uniqid.substr(4,2);
        return parseInt(ch);
    }
    static Getnodeid(uniqid)
    {
        let ch=uniqid.substr(1,2);
        return parseInt(ch);
    }

    static Getsensortype(uniqid)
    {
        let ch=uniqid.substr(7,2);
        return parseInt(ch);
    }



}




