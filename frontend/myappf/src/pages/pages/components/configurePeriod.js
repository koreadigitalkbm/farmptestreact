import { forwardRef, useState } from 'react'
import { Box, Button, IconButton, Modal, Stack, Typography } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import DatePicker, { registerLocale, getDefaultLocale, setDefaultLocale } from "react-datepicker"
import { ko, enUS } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css"

const supportLanguage = [
    { locale: 'ko', format: 'yyyy년 MM월 dd일' },
    { locale: 'enUS', format: 'MM/dd/yyyy' }
]

registerLocale('ko', ko);
registerLocale('enUS', enUS);

const MuiCustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button onClick={onClick} ref={ref}>{value}</Button>
));

export default function ConfigurePeriod(props) {
    const form = props.props;
    const format = form.format;
    const td = new Date(form.targetDate);
    const sd = new Date(form.startDate);
    const handleDatePicker = form.handleDatePicker;
    const onClick = form.onClick;

    const [openDatePicker, setOpenDatePicker] = useState(false);

    console.log(sd.getMonth() + 1);

    const tdString = td.getFullYear() + "-" + (td.getMonth() + 1) + "-" + td.getDate();
    const sdString = sd.getFullYear() + "-" + (sd.getMonth() + 1) + "-" + sd.getDate();

    const handleOpenDatePicker = () => setOpenDatePicker(true);
    const handleCloseDatePicker = () => setOpenDatePicker(false);

    if (format === "date") {
        return (
            <Stack direction='row' spacing={3} alignItems='center' justifyContent='center'>
                <IconButton name='oneDayAgo' onClick={onClick}>
                    <KeyboardArrowLeft />
                </IconButton>
                <Typography align="center">{tdString}<br />하루치 데이터를 조회합니다.</Typography>
                <IconButton name='oneDayAhead' onClick={onClick}>
                    <KeyboardArrowRight />
                </IconButton>
            </Stack>
        )
    } else if (format === "period") {
        return (
            <Stack direction='row' spacing={3} alignItems='center' justifyContent='center'>
                <DatePicker
                    dateFormat={supportLanguage[0].format}
                    locale={supportLanguage[0].locale}
                    selected={sd}
                    onChange={(date) => handleDatePicker(date)}
                    customInput={<MuiCustomInput />}>
                </DatePicker>
                <Typography align="center">{sdString + ' ~ ' + tdString}<br />기간동안의 데이터를 조회합니다.</Typography>
                <DatePicker
                    dateFormat={supportLanguage[0].format}
                    locale={supportLanguage[0].locale}
                    selected={sd}
                    onChange={(date) => handleDatePicker(date)}
                    customInput={<MuiCustomInput />}>
                </DatePicker>

            </Stack>
        )
    }
}