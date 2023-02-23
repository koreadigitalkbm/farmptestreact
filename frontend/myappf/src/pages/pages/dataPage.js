import { Grid, Paper, ThemeProvider } from '@mui/material';
import { styled } from '@mui/material/styles'
import muiTheme from '../muiTheme';

import { IconButton, Stack, Typography } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'


import RadioBtnGenerator from './components/radioBtnGenerator';
import DataVisualization from './components/dataVisualization';
import TableEventSystem from './components/tableEventSystem'
import ShowVerticalImages from './components/showVerticalImages';
import { useState } from 'react';
import MuiCustomDatePicker from './components/muiDatePicker';

const img1 = '/image/devicon_1.png'
const img2 = '/image/devicon_2.png'
const img3 = '/image/devicon_3.png'
const img4 = '/image/devicon_4.png'
const img5 = '/image/devicon_5.png'
const img6 = '/image/devicon_6.png'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: 15,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: 80,
}));

export default function DataPage(props) {
    const oneDay = 86400000;

    const [dataInqueryFormat, setDataInqueryFormat] = useState('date');
    const [targetDate, setTargetDate] = useState(Date.now());
    let period = [targetDate - (7 * oneDay ), targetDate];
    const [startDate, endDate] = period;


    const radioButtonOptions = ["date", "period"];
    const propsForRadioButton = {
        id: "radio-button-data-inquery-format",
        defaultValue: dataInqueryFormat,
        label: "데이터 조회 방식 설정",
        selectOptions: radioButtonOptions,
        onChange: handleDataInqueryFormat,
    }

    
    function handleDataInqueryFormat(e) {
        setDataInqueryFormat(e.target.value);
    }


    function handleDate(e) {
        switch (e.currentTarget.name) {
            case 'oneDayAgo':
                setTargetDate(targetDate - oneDay);
                break;
            case 'oneDayAhead':
                setTargetDate(targetDate + oneDay);
                break;
            default: return;
        }
    }

    const propsForDatepicker = {
        endDate: endDate,
        handleDatePicker: handleDatepicker,
        locale: 'ko',
        mode: '',
        selected: targetDate,
        startDate: startDate,
    }

    function handleDatepicker(date) {
        console.log(date);
        setTargetDate(Date.parse(date))
    }

    function handlePeriodpicker(p) {
        period = p;
    }

    // 이미지를 {img: url, title: 이름} 으로 정의해서 이미지셋으로 만듦.
    const testImageSet = [{ img: img1, title: '펌프' }, { img: img2, title: '팬' }, { img: img3, title: '밸브' }, { img: img4, title: 'LED' }, { img: img5, title: '에어컨' }, { img: img6, title: '히터' }];



    // 오늘 날짜를 yyyy.m.d로 만듦. 표만드는데 필수가 아님.
    const today = new Date();
    const endTargetDate = today.getFullYear() + "." + today.getMonth() + "." + today.getDay();
    // 단순한 치환. 표만드는데 필수가 아님.
    function tableType(type) {
        switch (type) {
            case 'sys': return '시스템'
            case 'acd': return '구동장비'
            case 'atc': return '자동제어'
            case 'etc': return '기타'
            default: return '미분류'
        }
    }

    // 표 헤더 정의. key값으로써 i18n으로 변환될 수 있어야 함.
    const tableHeader = ['date', 'type', 'content'];

    // 표에서 필터링할 행 정의. 아직 미구현
    const tableFilter = 'type'

    // 헤더에 맞춰서 표 내용을 Object로 만들어줌.
    function createData(date, type, content) {
        return {
            date,
            type,
            content,
        };
    }



    // 표 내용 정의.
    const dataSet = [
        createData(endTargetDate, tableType('atc'), '펌프 켬'),
        createData(endTargetDate, tableType('sys'), '목표치보다 수위가 낮음.'),
        createData(endTargetDate, tableType('acd'), 'LED 켬'),
        createData(endTargetDate, tableType('etc'), '물을 보충하는 날.'),
        createData(endTargetDate, tableType('etc'), '기기 온도가 높음.'),
        createData(endTargetDate, tableType('atc'), '히터 끔'),
        createData(endTargetDate, tableType('sys'), '목표치보다 온도가 높음'),
        createData(endTargetDate, tableType('sys'), '목표치보다 습도가 높음'),
        createData(endTargetDate, tableType('sys'), '목표치보다 ph가 높음'),
        createData(endTargetDate, tableType('etc'), '영양제를 보충하는 날.'),
        createData(endTargetDate, tableType('sys'), '목표치보다 수위가 높음.'),
        createData(endTargetDate, tableType('sys'), '목표치보다 EC가 높음'),
        createData(endTargetDate, tableType('acd'), 'LED 끔'),
        createData(endTargetDate, tableType('sys'), '점검 받음.'),
        createData(endTargetDate, tableType('atc'), '펌프 세기 낮춤'),
        createData(endTargetDate, tableType('sys'), '목표치보다 유속이 빠름.'),
        createData(endTargetDate, tableType('etc'), '펌프 청소하는 날.'),
    ]

    const ConfigurePeriod = () => {
        if(dataInqueryFormat === "date"){
            propsForDatepicker.mode = "date"
            propsForDatepicker.handleDatePicker = handleDatepicker;
            return (
                <Stack direction='row' alignItems='center' justifyContent='center'>
                    <IconButton name='oneDayAgo' onClick={handleDate}>
                        <KeyboardArrowLeft />
                    </IconButton>
                    <Typography align="center"><MuiCustomDatePicker props={propsForDatepicker} /><br />하루치 데이터를 조회합니다.</Typography>
                    <IconButton name='oneDayAhead' onClick={handleDate}>
                        <KeyboardArrowRight />
                    </IconButton>
                </Stack>
            )
        } else if (dataInqueryFormat === "period") {
            propsForDatepicker.mode = "period"
            propsForDatepicker.handleDatePicker = handlePeriodpicker;
            return (
                <Stack direction='row' alignItems='center' justifyContent='center'>
                    <Typography align="center"><MuiCustomDatePicker props={propsForDatepicker} /><br />기간동안의 데이터를 조회합니다.</Typography>
                </Stack>
            )
        }
    }

    return (
        <ThemeProvider theme={muiTheme}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Item><RadioBtnGenerator props={propsForRadioButton} /></Item>
                </Grid>
                <Grid item xs={8}>
                    <Item><ConfigurePeriod /></Item>
                </Grid>
            </Grid>
            <DataVisualization />
            <ShowVerticalImages imageSet={testImageSet} />
            <TableEventSystem tableHeader={tableHeader} tableFilter={tableFilter} dataSet={dataSet} />
        </ThemeProvider>
    )
}