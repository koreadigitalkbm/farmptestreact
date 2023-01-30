import React from "react";
import { InputAdornment, Stack, TextField, Typography } from "@mui/material"


export default class InputTemperatureInterval extends React.Component {

    constructor(props) {
        super(props)
        this.uid = props.uid
        this.defaultValue = props.defaultValue
        this.onChange = props.onChange;
    }

    render() {
        return (
            <Stack alignItems="center" direction="row" spacing={2}>
                <Typography>
                    온도 조절 간격:
                </Typography>

                <TextField
                    id={this.uid + "TemperatureInterval"}
                    key={this.uid + "TemperatureInterval"}
                    name="TemperatureInterval"
                    type="number"
                    variant="standard"
                    onChange={this.onChange}
                    defaultValue={this.defaultValue}
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
        )
    }
}