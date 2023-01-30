import React from "react";
import { InputAdornment, Stack, TextField, Typography } from "@mui/material"

import ButtonSave from "./btnSave";
import InputDaytimeRange from "./inputDaytimeRange";
import InputTemperatureInterval from "./InputTemperatureInterval";

export default class TemperatureControl extends React.Component {

    constructor(props) {
        super(props);
        this.state = props.autoConfiguration;
        this.handleClickAndChange = props.handleClickAndChange;
    }

    render() {
        return (
            <Stack spacing={1}>
                <Stack direction="row" alignItems="flex-end">
                    <Typography>내부 온도를 주간(9시~16시)에는</Typography>

                    <TextField
                        id="tf-targetTemperature-dayTime"
                        key={this.state.Uid + "DTValue"}
                        name="DTValue"
                        type="number"
                        variant="standard"
                        onChange={this.handleClickAndChange}
                        defaultValue={this.state.DTValue}
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
                        key={this.state.Uid + "NTValue"}
                        name="NTValue"
                        type="number"
                        variant="standard"
                        onChange={this.handleClickAndChange}
                        defaultValue={this.state.NTValue}
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

                <InputDaytimeRange uid={this.state.Uid} STime={this.state.STime} ETime={this.state.ETime} onChange={this.handleInputChange} />
                <InputTemperatureInterval uid={this.state.Uid} defaultValue="1" onChange={this.handleClickAndChange} />
                <hr />
            </Stack>
        )
    }

}