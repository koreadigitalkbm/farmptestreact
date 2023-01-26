import React from "react";
import {Button, Input, Stack, TextField, Typography } from "@mui/material"

import myAppGlobal from "../../../myAppGlobal";


export default class TemperatureControl extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = props.autoConfiguration;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    secToTime(dayseconds) {
        if (dayseconds >= 24 * 3600) {
            return "23:59";
        }
        let hour = Math.floor(dayseconds / 3600);
        let min = Math.floor((dayseconds - hour * 3600) / 60);
        if (hour < 10) hour = "0" + hour;
        if (min < 10) min = "0" + min;
        return hour + ":" + min;
    }

    timeTosec(timestr) {
        const [hours, minutes] = timestr.split(":");
        return Number(hours * 3600 + minutes * 60);
    }


    handleInputChange() {
        
        const DayTimeValue = document.getElementById("tf-targetTemperature-dayTime").value;
        const NightTimeValue = document.getElementById("tf-targetTemperature-nightTime").value;
        const StartTime = this.timeTosec(document.getElementById("if-startTime").value);
        const EndTime = this.timeTosec(document.getElementById("if-endTime").value);

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
                        defaultValue={this.secToTime(this.state.STime)}
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
                        defaultValue={this.secToTime(this.state.ETime)}
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