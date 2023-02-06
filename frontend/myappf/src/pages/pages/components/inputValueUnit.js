import React from "react";
import { InputAdornment, TextField } from "@mui/material"

import KDUtil from "../../../commonjs/kdutil";

export default function InputValueUnit(props) {

        let inputForm = undefined;
        let defaultValue = props.defaultValue;
        const name = props.name
        const onChange = props.onChange;
        const type = props.type;
        const uid = props.uid;
        const unit = props.unit;
        const variant = props.variant;

        if (type === "time") {
                defaultValue = KDUtil.secToTime(defaultValue);
        }

        inputForm = (
                <TextField
                        id={uid}
                        key={uid}
                        type={type}
                        name={name}
                        defaultValue={defaultValue}
                        onChange={onChange}
                        variant={variant}
                        sx={{
                                '& .MuiInputBase-input': {
                                        border: 0,
                                }
                        }}
                        InputProps={{
                                endAdornment: (
                                        <InputAdornment position="start">
                                                {unit}
                                        </InputAdornment>
                                )
                        }} />)
        return inputForm;
}