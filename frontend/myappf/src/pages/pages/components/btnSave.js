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
        // console.log("setupSave uid: " + this.state.Uid + " name : " + this.state.Name + " istimer : " + this.state.istimer);

        // myAppGlobal.farmapi.saveAutocontrolconfig(this.state).then((ret) => {
        //     console.log("setAutocontrolsetup  retMessage: " + ret.retMessage);
        // });
    }

    render() {
        return (
            <Button onClick={this.handleSave}>
                저장
            </Button>
        )
    }

}