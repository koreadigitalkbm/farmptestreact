import React, { useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";

import { Box, Button, Card, CardContent, CardHeader, Collapse, IconButton, Stack, Switch, Typography } from '@mui/material';

import { styled, ThemeProvider } from '@mui/material/styles';
import muiTheme from './../muiTheme';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import KDDefine from "../../commonjs/kddefine";
import KDUtil from "../../commonjs/kdutil";

import AutoControlconfig from "../../commonjs/autocontrolconfig";
import ManualControl from "./components/manualControl";
import TemperatureControl from "./components/temperatureControl"
import ButtonSave from "./components/btnSave";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

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

export default function ContorlPage() {
    const [Autolist, setAutolist] = React.useState([]);

    function AutoCard(props) {
        let copyData = AutoControlconfig.deepcopy(props.config)
        const [expanded, setExpanded] = React.useState(false)
        const [switchWorkmode, setSwitchWorkmode] = React.useState(copyData.Enb);

        function handleExpandClick() {
            setExpanded(!expanded);
        }

        function handleModeChange() {
            setSwitchWorkmode(!switchWorkmode);
        }

        function handleClickAndChange(e) {
            const targetName = e.target.name;
            switch (targetName) {
                case 'Save':
                    console.log(copyData);
                    myAppGlobal.farmapi.saveAutocontrolconfig(copyData).then((ret) => {
                        console.log("setAutocontrolsetup  retMessage: " + ret.retMessage);
                    })
                    break;

                case 'DTValue': 
                    copyData.DTValue = e.target.value;
                    console.log(copyData.DTValue);
                    break;

                case 'NTValue': copyData.NTValue = e.target.value;
                    break;

                case 'STime': copyData.STime = KDUtil.timeTosec(e.target.value);
                    break;

                case 'ETime': copyData.ETime = KDUtil.timeTosec(e.target.value);
                    break;

                case 'TemperatureInterval': copyData.TemperatureInterval = e.target.value;
                    break;

                default:
                    console.log("정의되지 않은 요소");
                    break;
            }
        }

        function formAutoContent() {
            if (copyData.Enb === false) {
                return <ManualControl autoItem={copyData} />
            } else {
                switch (copyData.Cat) {
                    case KDDefine.AUTOCategory.ACT_HEATING:
                        return <Typography>난방</Typography>

                    case KDDefine.AUTOCategory.ACT_COOLING:
                        return <Typography>냉방</Typography>

                    case KDDefine.AUTOCategory.ACT_LED:
                        return <Typography>광량</Typography>

                    case KDDefine.AUTOCategory.ATC_WATER:
                        return <Typography>관수</Typography>

                    case KDDefine.AUTOCategory.ATC_AIR:
                        return <Typography>환기</Typography>

                    case KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX:
                        return <TemperatureControl autoConfiguration={copyData} onChange={handleClickAndChange} />

                    case KDDefine.AUTOCategory.ACT_LED_MULTI_FOR_FJBOX:
                        return <Typography>3색LED</Typography>

                    case KDDefine.AUTOCategory.ACT_AIR_CO2_FOR_FJBOX:
                        return <Typography>CO2</Typography>

                    case KDDefine.AUTOCategory.ATC_USER:
                        return <Typography>사용자 지정</Typography>

                    default:
                        return (
                            <Box>
                                <Typography>디폴트</Typography>
                                <Typography>{copyData.Cat}</Typography>
                            </Box>
                        )
                }
            }
        }

        function AutoContent() {
            return (
                <Box>
                    {formAutoContent()}
                    <ButtonSave onClick={handleClickAndChange} />
                </Box>
            )
        }

        return (
            <Card sx={{ m: 1, mb: 2}}>
                <Stack direction="row" spacing={0.5} justifyContent="space-between" sx={{ pl: 2, pr: 2 }}>
                    <Typography sx={{ width: 150 }}>{copyData.Name}</Typography>
                    <Typography>{switchWorkmode ? '자동모드' : '수동모드'}</Typography>
                    <MaterialUISwitch checked={switchWorkmode} onChange={handleModeChange} />

                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="고급 설정"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </Stack>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <AutoContent />
                    </CardContent>
                </Collapse>
            </Card>
        )
    }

    function autoControlCard() {
        return (
            <Card sx={{ minWidth: 300, m: 3 }}>
                <CardHeader
                    title={'자동 제어'}
                />
                <Stack direction="column">
                    {Autolist.map((localState, index) => <AutoCard key={"autoCard" + index} config={localState} />)}
                </Stack>

                <Button>자동제어 추가</Button>
            </Card>
        )
    }

    useEffect(() => {
        myAppGlobal.farmapi.getAutocontrolconfig().then((ret) => {
            myAppGlobal.Autocontrolcfg = ret.retParam;
            console.log("----------------------------systeminformations auto length: " + myAppGlobal.Autocontrolcfg.length);

            setAutolist(myAppGlobal.Autocontrolcfg)
        });
    }, [])

    return (
        <ThemeProvider theme={muiTheme}>
            <Typography variant='h1'>제어 페이지입니다.</Typography>
            {autoControlCard()}
        </ThemeProvider>
    )
}