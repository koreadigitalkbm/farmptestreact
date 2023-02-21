import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { Box, Button, IconButton, Modal, Stack, Typography } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import Grid from "@mui/material/Grid";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import KDUtil from "../../commonjs/kdutil";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function DatePickerBar(props) {
    
    const oneDay = 86400000;
    const onGetdb = props.getdb;
    const issearching = props.issearching;
    const isdaily = props.isdaily;
    const onChange = props.onchangedaliy;
    

    
    const [openDatePicker, setOpenDatePicker] = useState(false);
    

    
    const [curdate, setcurdate] = useState(props.dayDate);

    const [startdate, setStartdate] = useState(props.startDate);
    const [enddate, setEnddate] = useState(props.endDate);


    const onChangeDate = props.onChangeDate;
    const label = "조회방식 선택하세요.";


    const curdatestring  = KDUtil.dateTostringforme(curdate, true,false);

    const endString = KDUtil.dateTostringforme(enddate, true,false);
    const startString = KDUtil.dateTostringforme(startdate, true,false);


    const handleOpenDatePicker = () => setOpenDatePicker(true);
    const handleCloseDatePicker = () => setOpenDatePicker(false);


    function onClickday(e)
    {

        let curday;
        switch (e.currentTarget.name) {
            case 'oneDayAgo':
                curday=curdate- oneDay;
                
                break;
            case 'oneDayAhead':
                curday= curdate+ oneDay;
                break;
            case 'searchday':
                onGetdb(startdate ,enddate);
                return ;
                
            default: return;
        }
        let utcnow = new Date();
        //현재날자보다는 작아야함.
       
            if( curday  <= utcnow)
            {
                setcurdate( curday);
                onGetdb(new Date(curday) , new Date(curday));
            }

        

    }
    function handleDatePicker()
    {

    }
  

    function pickertype()
    {
        if (isdaily === true) {
            return (
                <Stack direction='row' spacing={3} alignItems='center' justifyContent='center'>
                    <IconButton name='oneDayAgo' onClick={onClickday}>
                        <KeyboardArrowLeft />
                    </IconButton>
                    {issearching ==true? <CircularProgress />:null}

                    <Typography align="center">{curdatestring}<br />하루 데이터를 조회합니다.</Typography>
                    <IconButton name='oneDayAhead' onClick={onClickday}>
                        <KeyboardArrowRight />
                    </IconButton>
                </Stack>
            )
        } else {
            return (
                <Stack direction='row' spacing={3} alignItems='center' justifyContent='center'>
                    <Button onClick={handleOpenDatePicker}><KeyboardArrowLeft />시작날짜</Button>
                    {issearching ==true? <CircularProgress />:(  <IconButton name='searchday' onClick={onClickday}>
                        <QueryStatsIcon />
                    </IconButton>)}
                    <Typography align="center">{startString + ' ~ ' + endString}<br />기간동안의 데이터를 조회합니다.</Typography>
                    <Button onClick={handleOpenDatePicker}>종료날짜<KeyboardArrowRight /></Button>
                    <Modal
                        open={openDatePicker}
                        onClose={handleCloseDatePicker}
                        aria-labelledby="modal-modal-datepicker"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={modalStyle}>
                            <DatePicker selected={startdate} onChange={(date) => handleDatePicker(date)}></DatePicker>
                        </Box>
                    </Modal>
                </Stack>
            )
        }
    }

    


    return (
        <Grid container spacing={1}>
        <Grid item xs={3}>
        <FormControl>
            <FormLabel id={"f-label"}>{label}</FormLabel>
            <RadioGroup
                row
                aria-labelledby={"rg-label"}
                name={"rg-name"}
                
                onChange={onChange}
            >
             
                    <FormControlLabel checked={isdaily} value={"하루(1일)"}label={"하루(1일)"} control={<Radio />}/>
                    <FormControlLabel checked={!isdaily} value={"기간(60일)"}label={"기간(60일)"} control={<Radio />}/>
                
            </RadioGroup>
        </FormControl>
        </Grid>
        <Grid item xs={8}>
           {pickertype(true)}
        </Grid>
    </Grid>

    
    )
}

