import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";

import { Box, Button, Card, CardHeader, FormControlLabel, FormGroup, Stack, Switch, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { styled, ThemeProvider } from '@mui/material/styles';
import { AutoMode, ModeStandby } from '@mui/icons-material';
import { FormControl, InputLabel, Input, FormHelperText } from '@mui/material';

import KDDefine from "../../commonjs/kddefine";

import KDUtil from "../../commonjs/kdutil";
import muiTheme from './../muiTheme';
import AutoControlconfig from "../../commonjs/autocontrolconfig";
import ActuatorOperation from "./../../commonjs/actuatoroperation";

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
    const [formAutolist, setFormAutolist] = useState({});
    const [arrModeSwitch, setarrModeSwitch] = useState([]);
    const [currentAuto, setCurrentAuto] = useState();
    const [worktime, setWorktime] = useState();

    function manualonoff(actuid, onoff) {
        let opcmd = new ActuatorOperation(actuid, onoff, 30);
        myAppGlobal.farmapi.setActuatorOperation(opcmd).then((ret) => { });
    }

    const handlerModeChange = (event) => {
        const isChecked = event.target.checked;
        const name = event.target.name;
        const cat = event.currentTarget.cat;
        console.log("커런트타겟")
        console.log(cat)
        console.log("타겟")
        console.log(event.target)
        if (isChecked) {
            console.log(name + ": checked!");
        } else {
            console.log(name + ": unchecked!");
        }
    }

    function handlerInputworktime(e) {
        setWorktime(e.target.value);
    }

    function handlerInputChange(e, ci) {
        let handleName = e.target.name;
        let handleValue = e.target.value;
        switch (handleName) {
            case "DTValue":
                mAutolist[ci].DTValue = handleValue;
                break;

            case "NTValue":
                mAutolist[ci].NTValue = handleValue;
                break;

            case "STime":
                mAutolist[ci].STime = timeTosec(handleValue);
                break;

            case "ETime":
                mAutolist[ci].ETime = timeTosec(handleValue);
                break;

            default: console.log("정의되지 않음");
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
                    if (actuators.length > 0) {
                        setUpdate(actuators);
                    }
                }
            })
        }, readtimemsec);

        myAppGlobal.farmapi.getAutocontrolconfig().then((ret) => {
            myAppGlobal.Autocontrolcfg = ret.retParam;
            console.log("----------------------------systeminformations auto length: " + myAppGlobal.Autocontrolcfg.length);

            setUpdateauto(myAppGlobal.Autocontrolcfg);
        });

        const autoList123 = (mydata) => {
            let copyData = AutoControlconfig.deepcopy(mydata)

            setCurrentAuto(copyData)
        }

        return () => clearInterval(interval);
    }, []);

    function secToTime(dayseconds) {
        if (dayseconds >= 24 * 3600) {
            return "23:59";
        }
        let hour = Math.floor(dayseconds / 3600);
        let min = Math.floor((dayseconds - hour * 3600) / 60);
        if (hour < 10) hour = "0" + hour;
        if (min < 10) min = "0" + min;
        return hour + ":" + min;
    }

    function timeTosec(timestr) {
        const [hours, minutes] = timestr.split(":");
        return Number(hours * 3600 + minutes * 60);
    }

    function setupSave(ci) {
        console.log("setupSave uid: " + mAutolist[ci].Uid + " name : " + mAutolist[ci].Name + " istimer : " + mAutolist[ci].istimer);

        myAppGlobal.farmapi.saveAutocontrolconfig(mAutolist[ci]).then((ret) => {
            console.log("setAutocontrolsetup  retMessage: " + ret.retMessage);
        });
    }

    const formAutoContent = (ci) => {
        if (mAutolist[ci].Enb === false) {
            return (
                <Stack>
                    <TextField
                        id="tf-worktime"
                        label="동작시간"
                        type="number"
                        variant="outlined"
                        onChange={(e) => { setWorktime(e.target.value) }}
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
                            onClick={console.log(mAutolist[ci].Name + ": " + worktime)}>On</Button>
                        <Button>Off</Button>
                    </Stack>

                </Stack>
            )
        } else {
            switch (mAutolist[ci].Cat) {
                case KDDefine.AUTOCategory.ACT_HEATING:
                    return (
                        <Typography>난방</Typography>
                    )
                case KDDefine.AUTOCategory.ACT_COOLING:
                    return (
                        <Typography>냉방</Typography>
                    )
                case KDDefine.AUTOCategory.ACT_LED:
                    return (
                        <Typography>광량</Typography>
                    )
                case KDDefine.AUTOCategory.ATC_WATER:
                    return (
                        <Typography>관수</Typography>
                    )
                case KDDefine.AUTOCategory.ATC_AIR:
                    return (
                        <Typography>환기</Typography>
                    )
                case KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX:
                    return (
                        <Stack spacing={2}>
                            <TextField
                                id="tf-targetTemperature-daytime"
                                name="DTValue"
                                label="주간온도"
                                type="number"
                                variant="outlined"
                                onChange={(e) => { handlerInputChange(e, ci) }}
                                defaultValue={mAutolist[ci].DTValue}
                                sx={{
                                    width: 200,
                                    mt: 3,
                                    '& .MuiOutlinedInput-input': {
                                        width: 150,
                                        border: 0
                                    }
                                }} />
                            <TextField
                                id="tf-targetTemperature-night"
                                name="NTValue"
                                label="야간온도"
                                type="number"
                                variant="outlined"
                                onChange={(e) => { handlerInputChange(e, ci) }}
                                defaultValue={mAutolist[ci].NTValue}
                                sx={{
                                    width: 200,
                                    mt: 3,
                                    '& .MuiOutlinedInput-input': {
                                        width: 150,
                                        border: 0
                                    }
                                }} />

                            <Stack alignItems="center" direction="row" spacing={2}>
                                <Typography>
                                    주간시간설정:
                                </Typography>
                                <Input
                                    type="time"
                                    name="STime"
                                    defaultValue={secToTime(mAutolist[ci].STime)}
                                    onChange={(e) => { handlerInputChange(e, ci) }}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            border: 0,
                                            width: '100%'
                                        }
                                    }}
                                />
                                <Typography>
                                    ~
                                </Typography>
                                <Input
                                    type="time"
                                    name="ETime"
                                    defaultValue={secToTime(mAutolist[ci].ETime)}
                                    onChange={(e) => { handlerInputChange(e, ci) }}
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            border: 0,
                                            width: '100%'
                                        }
                                    }}
                                />
                            </Stack>
                        </Stack>
                    )
                case KDDefine.AUTOCategory.ACT_LED_MULTI_FOR_FJBOX:
                    return (
                        <Typography>3색LED</Typography>
                    )
                case KDDefine.AUTOCategory.ACT_AIR_CO2_FOR_FJBOX:
                    return (
                        <Typography>CO2</Typography>
                    )
                case KDDefine.AUTOCategory.ATC_USER:
                    return (
                        <Typography>사용자 지정</Typography>
                    )

                default:
                    return (
                        <Box>
                            <Typography>디폴트</Typography>
                            <Typography>{mAutolist[ci].Cat}</Typography>
                        </Box>
                    )
            }
        }
    }

    const autoContent = () => {
        if (currentAuto === undefined) {
            return
        } else {
            let ci = mAutolist.findIndex((e) => e.Uid === currentAuto.target.id)
            const contentName = mAutolist[ci].Name;
            return (
                <Box>
                    <Typography
                        variant='h2'>{contentName}</Typography>
                    {formAutoContent(ci)}
                    <Stack alignItems="center" direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button onClick={() => setupSave(ci)}>
                            저장
                        </Button>
                    </Stack>
                </Box>
            )
        }

    }

    const autoList = (mydata) => {
        let copyData = AutoControlconfig.deepcopy(mydata)
        return (
            <Button
                id={copyData.Uid}
                onClick={setCurrentAuto}
            >{copyData.Name}</Button>
        )

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
                        onChange={handlerModeChange} />}
                ></FormControlLabel>
            )
        }


        return (
            <Grid xs={2} sm={2} md={2} lg={2} xl={2}>

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

                    <Grid xs={2} sm={2} md={2} lg={2} xl={2}>
                        <Stack>
                            {mAutolist.map((localState) => autoList(localState))}
                        </Stack>
                    </Grid>
                    <Grid xs={10} sm={10} md={10} lg={10} xl={10}>
                        {autoContent()}
                    </Grid>

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
