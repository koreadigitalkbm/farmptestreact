

const ExcelJS = require("exceljs");
const saveAs = require("file-saver");

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
    
      // console.log("-----decodeDsensor sdatas.lenth 222: " + sdatas.length);
    
        for (let i = 0; i < sdatas.length; i++) {

          const msensor = ChartDataUtil.getsensorfromlist(sensorlistforchart, sdatas[i].P, sdatas[i].N, sdatas[i].C);
          let dTime = new Date(sdatas[i].T);
          const xydata = { x: dTime, y: sdatas[i].V };
    
          msensor.data.push(xydata);
        }

        //센서 순서를 정렬함. 센서 타입번호로 정렬 20240927

        let sensorlistforchartsort = [];
        for(let i=1;i<64;i++)
          {
        for(let j=0;j<sensorlistforchart.length;j++)
          {
            if(sensorlistforchart[j].stype == i)
              {
                sensorlistforchartsort.push(sensorlistforchart[j]);
               
              }
            //console.log("-------------------------sensorlistforchart  ---------------------" +sensorlistforchart[j].stype);
            
          }
        }

    
        return sensorlistforchartsort;
      }


      static async  MakexlsxforSensors(data, checkList, handleOpenModal, setSuccessSave) {

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sensor data');
        let excelData = [];
        worksheet.columns = [];
    
        excelData[0] = { column: 'Date', values: [] }
        data[0].data.forEach((sData) => {
            excelData[0].values.push(sData.x);
        })
        data.forEach((sensor, index) => {
            excelData.push({ column: sensor.label, values: [] })
            sensor.data.forEach((sData) => {
                excelData[index + 1].values.push(sData.y)
            })
        })
    
        for (let i = 0; i < excelData.length; i++) {
            checkList.forEach((check) => {
                if (check.label == excelData[i].column) {
                    if (check.checked == false) {
                        excelData.splice(i, 1);
                        i--;
                    }
                }
            })
        }
    
        if (excelData.length == 1) {
            setSuccessSave(false);
            handleOpenModal(true)
        } else {
            setSuccessSave(true);
            
            excelData.forEach(({ column, values }, index) => {
                worksheet.getColumn(index + 1).values = [column, ...values];
            })
    
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), 'sensorData.xlsx');
            handleOpenModal(true)
        }

      }


      
      static async  MakexlsxforLogs(data,  handleOpenModal, setSuccessSave) {

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Log data');
        let excelData = [];
        worksheet.columns = [];
    

     
        if (data.length <1) {
            setSuccessSave(false);
            handleOpenModal(true)
        } else {



          excelData.push({ column: 'Date', values: [] });
          excelData.push({ column: 'Type', values: [] });
          excelData.push({ column: 'Content', values: [] });
  
          data.forEach((logData) => {
              excelData[0].values.push(logData.date);
              excelData[1].values.push(logData.type);
              excelData[2].values.push(logData.content);
  
          })
       
       
          setSuccessSave(true);
            
            excelData.forEach(({ column, values }, index) => {
                worksheet.getColumn(index + 1).values = [column, ...values];
            })
    
            const buffer = await workbook.xlsx.writeBuffer();
            saveAs(new Blob([buffer]), 'LogData.xlsx');
            handleOpenModal(true)
        }

      }


};
