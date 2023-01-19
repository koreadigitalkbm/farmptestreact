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

let lasteventtime = 1;
let lastsensortime = 1;

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

    function handlerInputChange(n, v, ci) {
        console.log("핸들러 인풋체인지 : ");
        console.log(n);
        switch(n) {
            case "STime":
                mAutolist[ci].STime = timeTosec(v);
                console.log(mAutolist[ci].STime);
                break;

                case "ETime":
                    mAutolist[ci].ETime = timeTosec(v);
                console.log(mAutolist[ci].ETime);
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
            console.log('테스트중!@!@!@!@!@!@!@!@!@!@!@!@!@!@!!@!@!@!')
            console.log(currentAuto.Id + ':' + currentAuto.Cat)
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
        console.log("secToTime : " + (hour + ":" + min));
        return hour + ":" + min;
    }

    function timeTosec(timestr) {
        const [hours, minutes] = timestr.split(":");
        return Number(hours * 3600 + minutes * 60);
      }

    function setupSave(mcfg) {
        console.log("setupSave uid: " + mcfg.Uid + " name : " + mcfg.Name + " istimer : " + mcfg.istimer);

        // console.log("setupSave uid: " + " copycfg istimer : " + copycfg.istimer);

        // myAppGlobal.farmapi.saveAutocontrolconfig(mcfg).then((ret) => {
        //     console.log("setAutocontrolsetup  retMessage: " + ret.retMessage);
        // });
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
                                    label="주간온도"
                                    type="number"
                                    variant="outlined"
                                    onChange={(e) => { handlerInputChange(e, ci) }}
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
                                    label="야간온도"
                                    type="number"
                                    variant="outlined"
                                    onChange={(e) => { setWorktime(e.target.value) }}
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
                console.log(mAutolist[ci])
                return (
                    <Box>
                        <Typography
                            variant='h2'>{contentName}</Typography>
                        {formAutoContent(ci)}
                        <Stack alignItems="center" direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
                            <Button onClick={setupSave}>
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
