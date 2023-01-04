import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";

import { Box, Card, CardHeader, Switch, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import KDUtil from "../../commonjs/kdutil";
import muiTheme from './../muiTheme';

let lasteventtime = 1;
let lastsensortime = 1;

const ControlPage = (props) => {
    const [moutdevarray, setUpdate] = useState([]);
    const [mAutolist, setUpdateauto] = useState([]);

    useEffect(() => {
        let interval = null;
        let readtimemsec = 1000;

        if (myAppGlobal.islocal === false) {
            readtimemsec = 2000;
        }

        interval = setInterval(() => {
            myAppGlobal.farmapi.getDeviceStatus(true, true, false, lastsensortime, lasteventtime).then((ret) => {
                let actuators = ret.Outputs;

                if (actuators != null) {
                    console.log("actuators : " + actuators.length);
                    if (actuators.length > 0) {
                        setUpdate(actuators);
                    }
                }
            })
        }, readtimemsec);
        return () => clearInterval(interval);
    }, []);

    const actuatorCard = (actuatorarray, isonlystatus) => {
        actuatorarray.map((localState, index) => {
            let ismanual;

            let actinfo = KDUtil.GetActuatorinfofromid(myAppGlobal.systeminformations.Actuators, localState.Uid);

            if (localState.Opm === "LM") {
                ismanual = (
                    <div className="man_result">
                        <span className="blinking">현장제어중</span>
                    </div>
                );
            } else if (localState.Opm === "MA") {

            }


            return (
                <Card
                    key={localState.Uid + 'card'}
                >
                    <CardHeader
                        title={actinfo.Name}

                    />

                </Card>
            )
        })
    }

    const controlCard = () => {
        return (
            <Card sx={{ minWidth: 800, maxWidth: 'auto', m: 3 }}>
                <CardHeader
                    title={'정보 수정'}
                />
                {actuatorCard(moutdevarray, false)}
            </Card>
        )
    }

    return (
        <Box>
            <ThemeProvider theme={muiTheme}>
                <Typography variant='h1'>제어 페이지입니다.</Typography>
                {controlCard()}
            </ThemeProvider>
        </Box>
    )
}
export default ControlPage;