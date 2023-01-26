import React from "react";
import { Button, Stack, TextField } from "@mui/material"

export default class ManualContorl extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Uid: props.autoItem.Uid,
            name: props.autoItem.Name,
            worktime: 0,
        }
        this.worktime = this.worktime.bind(this);
    }

    worktime() {
        const workValue = document.getElementById("tf-worktime").value;
        this.setState({
            worktime: workValue
        })
    }

    render() {
        return (
            <Stack>
                <TextField
                    id="tf-worktime"
                    key={this.state.Uid + "worktime"}
                    label="동작시간"
                    type="number"
                    variant="outlined"
                    onChange={this.worktime}
                    sx={{
                        width: 150,
                        mt: 3,
                        '& .MuiOutlinedInput-input': {
                            width: 150,
                            border: 0
                        }
                    }} />
                <Stack direction="row" spacing={4}>
                    <Button
                        onClick={console.log(this.state.name + ": " + this.state.worktime)}
                    >
                        On
                    </Button>
                    <Button>
                        Off
                    </Button>
                </Stack>

            </Stack>
        )
    }
}