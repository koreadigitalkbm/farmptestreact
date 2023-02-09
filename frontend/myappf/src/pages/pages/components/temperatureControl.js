import React from "react";
import { Collapse, IconButton, InputAdornment, Stack, TextField, Typography } from "@mui/material"
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"


import InputDaytimeRange from "./inputDaytimeRange";
import InputTemperatureInterval from "./InputTemperatureInterval";


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function TemperatureControl(props) {

    let temperatureControlTemplate = undefined;
    const config = props.autoConfiguration;
    const onchange = props.onChange

    const [expanded, setExpanded] = React.useState(false)

    function handleExpandClick(e) {
        setExpanded(!expanded);
    }

    temperatureControlTemplate = (
        <Stack spacing={1}>
            <Stack direction="row" alignItems="flex-end">
                <Typography>내부 온도를 주간(9시~16시)에는</Typography>

                <TextField
                    id="tf-targetTemperature-dayTime"
                    key={config.Uid + "DTValue"}
                    name="DTValue"
                    type="number"
                    variant="standard"
                    onChange={onchange}
                    defaultValue={config.DTValue}
                    InputProps={{
                        endAdornment: (

                            <InputAdornment position="start">
                                ℃
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        mt: 3,
                        border: 0,
                        '& .MuiInputBase-input': {
                            border: 0
                        }
                    }} />
            </Stack>

            <Stack direction="row" alignItems="flex-end">
                <Typography>야간시간동안에는</Typography>

                <TextField
                    id="tf-targetTemperature-nightTime"
                    key={config.Uid + "NTValue"}
                    name="NTValue"
                    type="number"
                    variant="standard"
                    onChange={onchange}
                    defaultValue={config.NTValue}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                ℃
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        border: 0,
                        '& .MuiInputBase-input': {
                            border: 0
                        }
                    }} />

                <Typography>유지합니다.</Typography>
            </Stack>
            <Stack onClick={handleExpandClick} direction="row" alignItems="center" justifyContent="center" spacing="1">
                <Typography>고급설정</Typography>
                <ExpandMore
                    expand={expanded}
                    aria-expanded={expanded}
                    aria-label="설정 변경"
                >
                    <ExpandMoreIcon />
                </ExpandMore>
            </Stack>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <InputDaytimeRange uid={config.Uid} STime={config.STime} ETime={config.ETime} onChange={onchange} />
                <InputTemperatureInterval uid={config.Uid} defaultValue="1" onChange={onchange} />
            </Collapse>

            <hr />
        </Stack>

    )

    return temperatureControlTemplate
}