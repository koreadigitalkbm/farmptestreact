import { useState } from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { Box, Modal, Typography } from '@mui/material';

export default async function Makexlsx(data, checkList, handleOpenModal, setSuccessSave) {

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