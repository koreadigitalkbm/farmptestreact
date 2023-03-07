import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default async function Makexlsx(data) {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sensor data');
    let excelData = [];
    worksheet.columns = [];

    excelData[0] = {column: 'Date', values: []}
    data[0].data.forEach((sData) => {
        excelData[0].values.push(sData.x);
    })
    data.forEach((sensor, index) => {
        excelData.push({column: sensor.label, values: []})
        sensor.data.forEach((sData) => {
            excelData[index + 1].values.push(sData.y)
        })
    })
    console.log(excelData);


    excelData.forEach(({ column, values }, index) => {
        worksheet.getColumn(index + 1).values = [column, ...values];
    })

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), 'sensorData.xlsx');
}