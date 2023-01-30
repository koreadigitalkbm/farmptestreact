import React from "react";
import { Button } from "@mui/material";

export default class ButtonSave extends React.Component {

    constructor(props) {
        super(props)
        this.onClick = props.onClick;
    }

    render() {
        return (
            <Button name="Save" onClick={this.onClick}>
                저장
            </Button>
        )
    }

}