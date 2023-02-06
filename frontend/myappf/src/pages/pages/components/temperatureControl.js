import React from "react";
import { InputAdornment, Stack, TextField, Typography } from "@mui/material"

import InputDaytimeRange from "./inputDaytimeRange";
import InputTemperatureInterval from "./InputTemperatureInterval";

export default function TemperatureControl(props) {

    let temperatureControlTemplate = undefined;
    const config = props.autoConfiguration;
    const onchange = props.onChange

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

            <InputDaytimeRange uid={config.Uid} STime={config.STime} ETime={config.ETime} onChange={onchange} />
            <InputTemperatureInterval uid={config.Uid} defaultValue="1" onChange={onchange} />
            <hr />
        </Stack>
    )

    return temperatureControlTemplate
}