import React from "react";
import { Stack, Typography } from "@mui/material"

import InputValueUnit from "./inputValueUnit";

export default class InputDaytimeRange extends React.Component {

    constructor(props) {
        super(props)
        this.uid = props.uid;
        this.STime = props.STime;
        this.ETime = props.ETime;
        this.onChange = props.onChange;
    }

    render() {
        return (
            <Stack alignItems="center" direction="row" spacing={2}>
                <Typography>
                    주간시간설정:
                </Typography>
                <InputValueUnit
                    id={this.uid + "STime"}
                    key={this.uid + "STime"}
                    type="time"
                    variant="standard"
                    name="STime"
                    defaultValue={this.STime}
                    onChange={this.onChange}
                />

                <Typography> ~ </Typography>

                <InputValueUnit
                    id={this.uid + "ETime"}
                    key={this.uid + "ETime"}
                    type="time"
                    variant="standard"
                    name="ETime"
                    defaultValue={this.ETime}
                    onChange={this.onChange}
                />
            </Stack>
        )
    }
}