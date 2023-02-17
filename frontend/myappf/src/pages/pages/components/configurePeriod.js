import { useState } from 'react'
import { Box, Button, IconButton, Modal, Stack, Typography } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

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

export default function ConfigurePeriod(props) {
    const form = props.props;
    const format = form.format;
    const td = new Date(form.targetDate);
    const sd = new Date(form.startDate);
    const onClick = form.onClick;

    const [openDatePicker, setOpenDatePicker] = useState(false);

    const tdString = td.getFullYear() + "-" + td.getMonth() + 1 + "-" + td.getDate();
    const sdString = sd.getFullYear() + "-" + sd.getMonth() + 1 + "-" + sd.getDate();

    const handleOpenDatePicker = () => setOpenDatePicker(true);
    const handleCloseDatePicker = () => setOpenDatePicker(false);

    if (format === "date") {
        return (
            <Stack direction='row' spacing={3}>
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
            <Stack direction='row' spacing={3}>
                <Button onClick={handleOpenDatePicker}><KeyboardArrowLeft />시작날짜</Button>
                <Typography align="center">{sdString + ' ~ ' + tdString}<br />기간동안의 데이터를 조회합니다.</Typography>
                <Button>종료날짜<KeyboardArrowRight /></Button>
                <Modal
                    open={openDatePicker}
                    onClose={handleCloseDatePicker}
                    aria-labelledby="modal-modal-datepicker"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <DatePicker selected={sd} onChange={(date) => console.log(date)}></DatePicker>
                    </Box>
                </Modal>
            </Stack>
        )
    }
}