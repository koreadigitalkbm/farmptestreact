
module.exports = class ChartDataUtil {

    static getsensorfromlist(sensorlistforchart, stype, nodeid, channel) {
        for (let i = 0; i < sensorlistforchart.length; i++) {
          if (sensorlistforchart[i].stype === stype && sensorlistforchart[i].nodeid == nodeid && sensorlistforchart[i].channel == channel) {
            return sensorlistforchart[i];
          }
        }
    
        let newdatas = {
          stype: stype,
          nodeid: nodeid,
          channel: channel,
          type: "line",
          label: "온도",
          yAxisID: "y-left",
          pointStyle: "triangle",
          pointRadius: 0,
          borderColor: "rgb(24, 112, 235)",
          borderWidth: 2,
          data: [],
        };
        sensorlistforchart.push(newdatas);
    
        return newdatas;
      }
    
      static getchartdatafromsensor(sdatas) {
        let sensorlistforchart = [];
    
        console.log("------decodeDsensor sdatas.lenth 2: " + sdatas.length);
    
        for (let i = 0; i < sdatas.length; i++) {

          const msensor = ChartDataUtil.getsensorfromlist(sensorlistforchart, sdatas[i].P, sdatas[i].N, sdatas[i].C);
          let dTime = new Date(sdatas[i].T);
          const xydata = { x: dTime, y: sdatas[i].V };
    
          msensor.data.push(xydata);
        }
    
        return sensorlistforchart;
      }


};
