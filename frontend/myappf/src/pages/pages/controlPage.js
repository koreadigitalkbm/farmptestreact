import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch'

const ControlPage = (props) => {
    const [deviceList, setDeviceList] = useState([]);

    const label = { inputProps: { 'aria-label': 'Swtich demo' } };

    useEffect(() => {
        let interval = null;

        //aws 접속이면 5초에 한번만 읽자 머니 나가니까.
        let readtimemsec = 1000;
        if (myAppGlobal.islocal == false) {
            readtimemsec = 2000;
        }
        interval = setInterval(() => {
            myAppGlobal.farmapi.getDeviceStatus().then((ret) => {
                let actuators = ret.Outputs;
                if (actuators != null) {
                    console.log("actuators : " + actuators.length);
                    if (actuators.length > 0) {
                        setDeviceList(actuators);
                    }
                }


            });
        }, readtimemsec);

        return () => clearInterval(interval);
    }, []);


    return (
        <Box>
            <Switch {...label} defaultChecked />
            <Box>
                <Typography variant='h3'>제어 페이지입니다.</Typography>
            </Box>
        </Box>
    )
}
export default ControlPage;