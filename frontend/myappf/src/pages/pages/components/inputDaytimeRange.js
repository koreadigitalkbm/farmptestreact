import React from "react";
import { Input, Stack, Typography } from "@mui/material"

import KDUtil from "../../../commonjs/kdutil";

export default class InputDaytimeRange extends React.Component {

    constructor(props) {
        super(props)
        this.uid = props.confID;
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

                    <Input
                        id={this.uid + "STime"}
                        key={this.uid + "STime"}
                        type="time"
                        name="STime"
                        defaultValue={KDUtil.secToTime(this.STime)}
                        onChange={this.onChange}
                        sx={{
                            '& .MuiInputBase-input': {
                                border: 0,
                                width: '100%'
                            }
                        }} />

                    <Typography> ~ </Typography>

                    <Input
                        id={this.uid + "ETime"}
                        key={this.uid + "ETime"}
                        type="time"
                        name="ETime"
                        defaultValue={KDUtil.secToTime(this.ETime)}
                        onChange={this.onChange}
                        sx={{
                            '& .MuiInputBase-input': {
                                border: 0,
                                width: '100%'
                            }
                        }} />
                </Stack>
        )
    }
}