//메모리에 하루동안의 데이터만 저장해보자




module.exports = class DailyCurrentDatas {
  constructor() {
    this.DSensors = []; //센서데이터
    this.DEvents = []; //자동제어, 구동기변경, 기타 로그
    this.LastimageFilename;
  }

  updateCpatureimage(fname)
  {
    this.LastimageFilename= fname;
  }
  updateEvent(mevent) {
    //배열 1000개 넘어가면 앞부분 100개 삭제
    if (this.DEvents.length >= 1000) {
      this.DEvents.splice(0, 100);
    }
    this.DEvents.push(mevent);

    

  }

  updateSensor(mdatetime, curdata) {
    //배열 2000개 넘어가면 앞부분 100개 삭제
    if (this.DSensors.length >= 2000) {
      this.DSensors.splice(0, 100);
    }
    if(curdata.length>0)
    {
    let newitem = new DailySensor(mdatetime,curdata);
    this.DSensors.push(newitem);
    }

  //  for (const msensor of newitem.SLIST) {
  //    console.log("updateSensr time : " + newitem.SDate + ", ID: " + msensor.Uid + ", value:" + msensor.Val);
  //  }
  }

  // 업데이트된 데이터만 모아서 보낸다. 
  getdatabytime(sensorlasttime, eventlasttime)
  {
    let sysevts= new  DailyCurrentDatas();
    for(let i=0;i<this.DSensors.length;i++)
    {
      let timemsec = (new Date(this.DSensors[i].SDate)).getTime();

      //console.log("getdatabytime DSensors : " + this.DSensors[i].SDate  + " sensorlasttime : "+ sensorlasttime + "timemsec : " +timemsec);


      if(timemsec >sensorlasttime )
      {
        sysevts.DSensors.push(this.DSensors[i]);
      }
    }

    for(let i=0;i<this.DEvents.length;i++)
    {
      let timemsec = (new Date(this.DEvents[i].EDate)).getTime();

      //console.log("getdatabytime DEvents : " + this.DEvents[i].EDate  + " eventlasttime : "+ eventlasttime+ " timemsec : " +timemsec);

      if(timemsec >eventlasttime )
      {
        
        sysevts.DEvents.push(this.DEvents[i]);
      }
    }
    sysevts.LastimageFilename = this.LastimageFilename;
    
    return sysevts;
  }

};

class DailySensor {
  constructor(mdate ,dsensors) {
    this.SDate = mdate;
    this.SLIST = dsensors; //센서
  }
}
