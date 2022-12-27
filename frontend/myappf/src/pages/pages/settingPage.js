import React, { useState, useEffect } from "react"

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { ThemeProvider, styled } from '@mui/material/styles'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup'

import muiTheme from './../muiTheme';
import myAppGlobal from "../../myAppGlobal"
import DeviceSystemconfig from "../../commonjs/devsystemconfig"

import { createTheme } from '@mui/material/styles'

const theme = muiTheme

const SettingPage = (props) => {
  console.log("-------------------------SettingPage---------------------Systeminfo : " + props.Systeminfo);

  const [systestinfo, setTestinfo] = useState(null);
  const [myInfo, setMyInfo] = useState([]);
  const [myNewInfoFrame, setMyNewInfoFrame] = useState([]);
  const [changeMyInfoResult, setChangeMyInfoResult] = useState("결과")
  const [currentDeviceName, setCurrentDeviceName] = useState("")
  const [currentDeviceID, setCurrentDeviceID] = useState("")
  const [currentComport, setCurrentComport] = useState("")
  const currentPassword = '******'

  let newDeviceName
  let newDeviceID
  let newComport
  let newPassword

  const theme123 = createTheme({
    components: {
      MuiOutlinedInput: {
        defaultProps: {
          notched: false,
        },
      },
      MuiInputLabel: {
        defaultProps: {
          shrink: false,
        },
      }
    },
  });

  useEffect(() => {

    console.log("SettingPage useEffect : " + props.Systeminfo);

    if (props.Systeminfo != null) {
      setMyInfo([
        {
          id: 'currentAlias',
          label: '기기닉네임',
          value: myAppGlobal.systeminformations.Systemconfg.productname
        },
        {
          id: 'connectHost',
          label: '연결된 호스트',
          value: 'Windows'
        },
        {
          id: 'connectPort',
          label: '연결된 포트번호',
          value: myAppGlobal.systeminformations.Systemconfg.comport
        }
      ]);

      setMyNewInfoFrame([
        {
          id: 'newAlias',
          label: '새 기기닉네임',
          type: 'text'
        },
        {
          id: 'newPort',
          label: '새 포트번호',
          type: 'number'
        },
        {
          id: 'newPassword',
          label: '새 비밀번호',
          type: 'password'
        }
      ])

      setTestinfo(props.Systeminfo);
      setCurrentDeviceName(myAppGlobal.systeminformations.Systemconfg.productname);
      setCurrentComport(myAppGlobal.systeminformations.Systemconfg.comport);
    }
  }, [props.Systeminfo]);

  const getMyNewInfoFrame = (myNewI) => {
    switch (myNewI.id) {
      case 'newAlias':
        console.log(myNewI.type);
        return (
          <TextField
            required
            id={myNewI.id + "tf"}
            label={myNewI.label}
            type={myNewI.type}
            variant="outlined"
            onChange={inputonchangeHandler}
            sx={{
              '& .MuiOutlinedInput-input': {
                border: 0
              }
            }} />)
      case 'newPort':
        console.log(myNewI.type);
        return (
          <TextField
            required
            id={myNewI.id + "tf"}
            label={myNewI.label}
            variant="filled"
            type={myNewI.type}
            defaultValue={myInfo[1].rowValue}
            onChange={inputonchangeHandler}
            InputProps={{
              inputProps: {
                max: 100, min: 1
            }}}
            sx={{
              '& .MuiFilledInput-input': {
                border: 0,
                width: '100%'
              }
            }} />)
      case 'newPassword':
        console.log(myNewI.type);
        return (
          <TextField
            required
            fullWidth
            id={myNewI.id + "tf"}
            label={myNewI.label}
            variant="standard"
            type={myNewI.type}
            autoComplete="current-password"
            onChange={inputonchangeHandler}
          />)
      default:
        return <Typography>정의되지 않은 라벨</Typography>
    }
  }

  const myCurrentInfo = (
    <Box sx={{ flexGrow: 1, p: 2 }} >
      <Typography variant="h3" sx={{ mb: 2 }}>나의 정보</Typography>
      <Grid container spacing={2}>
        {myInfo.map((myI) => (
          <Grid item key={myI.id} xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography variant="h6">{myI.label}</Typography>
            <Typography variant="body1">{myI.value}</Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const myNewInfo = (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch', },
      }}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h3" sx={{ mb: 2 }}>정보 수정</Typography>
      <Grid container spacing={1}>
        {myNewInfoFrame.map((myNewI) => (
          <Grid item key={myNewI.id} xs={12} sm={12} md={12} lg={12} xl={12}>
            {getMyNewInfoFrame(myNewI)}
          </Grid>
        ))}
      </Grid>
      <Stack spacing={2} direction="row" sx={{ mt: 2 }}>
        <Button type="reset" variant="outlined" endIcon={<DeleteIcon />}>취소</Button>
        <Button type="submit" variant="contained" endIcon={<SendIcon />} onClick={setMyInfoHandler}>수정하기</Button>
      </Stack>
    </Box>

  );

  function inputonchangeHandler(e) {
    switch (e.target.id) {
      case 'newAlias':
        newDeviceName = e.target.value;
        break;

      case 'inputNewComport':
        newComport = e.target.value;
        break;

      case 'inputNewDeviceID':
        newDeviceID = e.target.value;
        break;

      case 'inputNewDevicePW':
        newPassword = e.target.value;
        break;

      default:
        console.log('입력오류 발생');
    }
  }

  function setMyInfoHandler(e) {
    console.log('전송!');
    // let newconf = new DeviceSystemconfig();

    // newconf.name = "ghfh";
    // newconf.deviceuniqid = myAppGlobal.systeminformations.Systemconfg.deviceuniqid;
    // newconf.comport = myAppGlobal.systeminformations.Systemconfg.comport;
    // newconf.password = myAppGlobal.systeminformations.Systemconfg.password;
    // newconf.productname = myAppGlobal.systeminformations.Systemconfg.productname;
    // newconf.productmodel = myAppGlobal.systeminformations.Systemconfg.productmodel;

    // myAppGlobal.farmapi.setMyInfo(newconf).then((ret) => {
    //   if (ret) {
    //     if (ret.IsOK === true) {
    //       if (ret.retMessage === 'ok') {
    //         setCurrentDeviceName(newDeviceName);
    //         setCurrentDeviceID(newDeviceID);
    //         setCurrentComport(newComport);
    //       }
    //   }
    // })
  }

  function setupss() {
    console.log("-------------------------setupss---------------------systestinfo : " + props.Systeminfo);
    if (props.Systeminfo == null) {
      return <div> nodata... </div>
    }
    else {
      return (
        <Box align="center">
          <ThemeProvider theme={theme}>
            <Typography variant="h1">설정페이지</Typography>
            {myCurrentInfo}
            {myNewInfo}
            {changeMyInfoResult}
          </ThemeProvider>
        </Box>
      );
    }

  }



  return (<div>{setupss()}</div>
  );
}
export default SettingPage;