import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";

import { Box, Button, Card, CardHeader, FormControlLabel, FormGroup, Stack, Switch, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { styled, ThemeProvider } from '@mui/material/styles';
import { AutoMode, ModeStandby } from '@mui/icons-material';

import KDUtil from "../../commonjs/kdutil";
import ActuatorOperation from "./../../commonjs/actuatoroperation";

import muiTheme from './../muiTheme';

let lasteventtime = 1;
let lastsensortime = 1;

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                borderRadius: 20,
                backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="-2 0 25 25"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M19.03 3.56c-1.67-1.39-3.74-2.3-6.03-2.51v2.01c1.73.19 3.31.88 4.61 1.92l1.42-1.42zM11 3.06V1.05c-2.29.2-4.36 1.12-6.03 2.51l1.42 1.42C7.69 3.94 9.27 3.25 11 3.06zM4.98 6.39 3.56 4.97C2.17 6.64 1.26 8.71 1.05 11h2.01c.19-1.73.88-3.31 1.92-4.61zM20.94 11h2.01c-.21-2.29-1.12-4.36-2.51-6.03l-1.42 1.42c1.04 1.3 1.73 2.88 1.92 4.61zM7 12l3.44 1.56L12 17l1.56-3.44L17 12l-3.44-1.56L12 7l-1.56 3.44zM12 21c-3.11 0-5.85-1.59-7.46-4H7v-2H1v6h2v-2.7c1.99 2.84 5.27 4.7 9 4.7 4.87 0 9-3.17 10.44-7.56l-1.96-.45C19.25 18.48 15.92 21 12 21z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        width: 32,
        height: 32,

        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            borderRadius: 20,
            backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#C62828',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 25 25"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const ControlPage = (props) => {
    const [moutdevarray, setUpdate] = useState([]);
    const [mAutolist, setUpdateauto] = useState([]);
    const [arrModeSwitch, setarrModeSwitch] = useState([]);

    function manualonoff(actuid, onoff) {
        let opcmd = new ActuatorOperation(actuid, onoff, 30);
        myAppGlobal.farmapi.setActuatorOperation(opcmd).then((ret) => { });
    }

    const handleModeChange = (event) => {
        const isChecked = event.currentTarget.checked;
        const name = event.target.name;

        if (isChecked) {
            console.log(name + ": checked!");
        } else {
            console.log(name + ": unchecked!");
        }
    }

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
                    console.log(actuators);
                }
            })
        }, readtimemsec);

        myAppGlobal.farmapi.getAutocontrolconfig().then((ret) => {
            myAppGlobal.Autocontrolcfg = ret.retParam;
            console.log("----------------------------systeminformations auto length: " + myAppGlobal.Autocontrolcfg.length);

            setUpdateauto(myAppGlobal.Autocontrolcfg);
        });

        return () => clearInterval(interval);
    }, []);

    const autoCard = (mydata, mseldata) => {

    }

    const actuatorCard = (actuator, isonlystatus, index) => {

        let ismanual;
        let ismanual2 = ""
        let actinfo = KDUtil.GetActuatorinfofromid(myAppGlobal.systeminformations.Actuators, actuator.Uid);

        if (actuator.Opm === "LM") {
            ismanual = <Typography>현장제어중</Typography>
        } else if (actuator.Opm === "MA") {
            if (isonlystatus === true) {
                ismanual2 = "수동제어"
                ismanual = (
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography sx={{ verticalAlign: "middle" }} style={{ verticalAlign: "center" }}>수동제어</Typography>
                        <Switch></Switch>
                    </Stack>
                )
            }
        } else {
            ismanual2 = "자동제어"
            ismanual = (
                <FormControlLabel
                    label={ismanual2}
                    labelPlacement="start"
                    control={<MaterialUISwitch
                        name={actinfo.Name}
                        onChange={handleModeChange} />}
                ></FormControlLabel>
            )
        }


        return (
            <Grid xs={12} sm={6} md={4} lg={4} xl={3}>
                <Card
                    sx={{ minWidth: 250, maxWidth: { xs: 250, sm: 250, md: 250, lg: 300, xl: 400 }, mt: 1, mb: 1 }}
                    key={actuator.Uid + 'card'}
                >
                    <CardHeader
                        title={actinfo.Name}
                    />
                    <FormGroup>
                        {ismanual}
                    </FormGroup>
                </Card>
            </Grid>

        )
    }

    const autoControlCard = () => {
        return (
            <Card maxWidth={{}} sx={{ minWidth: 300, m: 3 }}>
                <CardHeader
                    title={'자동 제어'}
                />
                <Grid container spacing={2}>
                    {/* {mAutolist.map((localState, index) => autoControlCard(localState, mS))} */}
                </Grid>
                <Button>자동제어 추가</Button>
            </Card>
        )
    }

    const actuatorControlCard = () => {
        return (
            <Card maxWidth={{}} sx={{ minWidth: 300, m: 3 }}>
                <CardHeader
                    title={'구동기 제어'}
                />
                <Grid container spacing={2}>
                    {moutdevarray.map((localState, index) => actuatorCard(localState, false, index))}
                </Grid>
            </Card>
        )
    }

    return (
        <Box>
            <ThemeProvider theme={muiTheme}>
                <Typography variant='h1'>제어 페이지입니다.</Typography>
                {autoControlCard()}
                {actuatorControlCard()}
            </ThemeProvider>
        </Box>
    )
}
export default ControlPage;