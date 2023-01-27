import React from "react";
import { Button } from "@mui/material";

import myAppGlobal from "../../../myAppGlobal";

export default class ButtonSave extends React.Component {

    constructor(props) {
        super(props)
        this.state = props.saveObject;
        this.handleSave = this.handleSave.bind(this)
    }

    handleSave() {
        console.log(this.state);
    }

    render() {
        return (
            <Button onClick={this.handleSave}>
                저장
            </Button>
        )
    }

}