import React from "react";
import { Stack, Typography } from "@mui/material"

import InputValueUnit from "./inputValueUnit";

export default class InputTemperatureInterval extends React.Component {

    constructor(props) {
        super(props)
        this.uid = props.uid
        this.defaultValue = props.defaultValue
        this.onChange = props.handleClickAndChange;
    }

    render() {
        return (
            <Stack alignItems="center" direction="row" spacing={2}>
                <Typography>
                    온도 조절 간격:
                </Typography>

                <InputValueUnit 
                    id={this.uid + "TemperatureInterval"}
                    key={this.uid + "TemperatureInterval"}
                    name="TemperatureInterval"
                    type="number"
                    variant="standard"
                    defaultValue = {this.defaultValue}
                    onchange={this.onchnage}
                    unit="℃"/>
            </Stack>
        )
    }
}