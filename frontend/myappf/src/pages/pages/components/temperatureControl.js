import React from "react";
import {Button, Input, Stack, TextField, Typography } from "@mui/material"

import KDUtil from "../../../commonjs/kdutil";
import myAppGlobal from "../../../myAppGlobal";


export default class TemperatureControl extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = props.autoConfiguration;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    handleInputChange() {       
        const DayTimeValue = document.getElementById("tf-targetTemperature-dayTime").value;
        const NightTimeValue = document.getElementById("tf-targetTemperature-nightTime").value;
        const StartTime = KDUtil.timeTosec(document.getElementById("if-startTime").value);
        const EndTime = KDUtil.timeTosec(document.getElementById("if-endTime").value);

        this.setState((state) => {
            state.DTValue = DayTimeValue;
            state.NTValue = NightTimeValue;
            state.STime = StartTime;
            state.ETime = EndTime;
            return state
        })
        console.log(this.state);
    }

    handleSave() {
        console.log(this.state);
        
        myAppGlobal.farmapi.saveAutocontrolconfig(this.state).then((ret) => {
            console.log("setAutocontrolsetup  retMessage: " + ret.retMessage);
        });
    }

    render() {
        return (
            <Stack spacing={2}>
                <TextField
                    id="tf-targetTemperature-dayTime"
                    key={this.state.Uid + "DTValue"}
                    name="DTValue"
                    label="주간온도"
                    type="number"
                    variant="outlined"
                    onChange={this.handleInputChange}
                    defaultValue={this.state.DTValue}
                    sx={{
                        width: 200,
                        mt: 3,
                        '& .MuiOutlinedInput-input': {
                            width: 150,
                            border: 0
                        }
                    }} />
                <TextField
                    id="tf-targetTemperature-nightTime"
                    key={this.state.Uid + "NTValue"}
                    name="NTValue"
                    label="야간온도"
                    type="number"
                    variant="outlined"
                    onChange={this.handleInputChange}
                    defaultValue={this.state.NTValue}
                    sx={{
                        width: 200,
                        mt: 3,
                        '& .MuiOutlinedInput-input': {
                            width: 150,
                            border: 0
                        }
                    }} />

                <Stack alignItems="center" direction="row" spacing={2}>
                    <Typography>
                        주간시간설정:
                    </Typography>

                    <Input
                        id="if-startTime"
                        key={this.state.Uid + "STime"}
                        type="time"
                        name="STime"
                        defaultValue={KDUtil.secToTime(this.state.STime)}
                        onChange={this.handleInputChange}
                        sx={{
                            '& .MuiInputBase-input': {
                                border: 0,
                                width: '100%'
                            }
                        }} />

                    <Typography> ~ </Typography>

                    <Input
                        id="if-endTime"
                        key={this.state.Uid + "ETime"}
                        type="time"
                        name="ETime"
                        defaultValue={KDUtil.secToTime(this.state.ETime)}
                        onChange={this.handleInputChange}
                        sx={{
                            '& .MuiInputBase-input': {
                                border: 0,
                                width: '100%'
                            }
                        }} />
                </Stack>
                <hr />
                <Button onClick={this.handleSave}>저장</Button>
            </Stack>
        )
    }

}