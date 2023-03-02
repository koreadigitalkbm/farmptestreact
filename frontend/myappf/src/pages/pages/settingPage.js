import React, { useState, useEffect } from "react"

import {Box, Button, Card, CardHeader, Divider, Modal, Stack, TextField, Typography} from'@mui/material'
import Grid from '@mui/material/Unstable_Grid2';

import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { ThemeProvider } from '@mui/material/styles'

import muiTheme from './../muiTheme';
import myAppGlobal from "../../myAppGlobal"

import DeviceSystemconfig from "../../commonjs/devsystemconfig"
import { useTranslation } from "react-i18next";

const theme = muiTheme

export default function SettingPage(props) {
  const { t } = useTranslation();

  const [now, setNow] = useState(new Date());
  const [deviceTime, setDeviceTime] = useState();

  const [myInfo, setMyInfo] = useState([]);
  const [myNewInfoFrame, setMyNewInfoFrame] = useState([]);
  const [deviceversion, setDeviceversion] = useState(0);
  const [serverversion, setServerversion] = useState(0);

  const [isLatest, setIsLatest] = useState();

  const [configureResult, setConfigureResult] = useState(false);
  const [modalTitle, setModalTitle] = useState('모달제목 입니다.');
  const [modalDescription, setModalDescription] = useState('모달설명 입니다.');
  const handleOpen = () => setConfigureResult(true);
  const handleClose = () => setConfigureResult(false);

  let isupdate = false;
  let loginrole = window.sessionStorage.getItem("login");

  let newDeviceName
  let newPort
  let newPasswordLocal

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useEffect(() => {

    if (myAppGlobal.islocal === false) {
      myAppGlobal.farmapi.getdeviceversion(true).then((ret) => {
        console.log(" get server version ret : " + ret.retMessage);
        setServerversion(ret.retMessage);
      });
    }

    myAppGlobal.farmapi.getdeviceversion(false).then((ret) => {
      console.log("getdevice version ret1 : " + ret.retMessage);
      setDeviceversion(ret.retMessage);
    });

    /*
    if (deviceversion < serverversion) {
      setIsLatest('최신 업데이트가 있습니다.');
    } else if (deviceversion === serverversion) {
      setIsLatest('현재 최신버전입니다.');
    } else {
      setIsLatest('서버보다 버전이 높습니다.');
    }
    */

    if (props.Systeminfo != null) {
      setMyInfo([
        {
          id: 'currentDeviceId',
          label: t('DeviceID'),
          value: myAppGlobal.systeminformations.Systemconfg.deviceuniqid
        },
        {
          id: 'currentModelName',
          label: t('ModelName'),
          value: myAppGlobal.systeminformations.Systemconfg.productmodel
        },
        {
          id: 'currentBrandName',
          label: t('BrandName'),
          value: myAppGlobal.systeminformations.Systemconfg.productname
        },
        {
          id: 'currentAlias',
          label: t('DeviceName'),
          value: myAppGlobal.systeminformations.Systemconfg.name
        },
        {
          id: 'connectPort',
          label: t('ConnectedPort'),
          value: myAppGlobal.systeminformations.Systemconfg.comport
        }
      ]);

      setMyNewInfoFrame([
        {
          id: 'newAlias',
          label: t('NewDeviceName'),
          type: 'text'
        },
        {
          id: 'newPort',
          label: t('NewLocalPW'),
          type: 'text'
        },
        {
          id: 'newPasswordLocal',
          label: t('NewPort'),
          type: 'password'
        }
      ])
    }

  }, [props.Systeminfo]);

  if (serverversion > deviceversion && deviceversion > 0) {
    isupdate = true;
  }

  

  const getMyNewInfoFrame = (myNewI) => {
    switch (myNewI.id) {
      case 'newAlias':
        return (
          <TextField
            required
            id={myNewI.id}
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
        return (
          <TextField
            required
            id={myNewI.id}
            label={myNewI.label}
            variant="filled"
            type={myNewI.type}
            defaultValue={myInfo[1].rowValue}
            onChange={inputonchangeHandler}
            InputProps={{
              inputProps: {
                max: 100, min: 1
              }
            }}
            sx={{
              '& .MuiFilledInput-input': {
                border: 0,
                width: '100%'
              }
            }} />)
      case 'newPasswordLocal':
        return (
          <TextField
            required
            fullWidth
            id={myNewI.id}
            label={myNewI.label}
            variant="standard"
            type={myNewI.type}
            autoComplete="current-password"
            onChange={inputonchangeHandler}
          />)
      default:
        return <Typography>정의되지 않은 프레임</Typography>
    }
  }

  const myCurrentInfo = (
    <Card sx={{ minWidth: 200, maxWidth: 'auto', m: 3 }}>
      <CardHeader
        title={t('MyInformation')}
      />
      <Box sx={{ flexGrow: 1, p: 2 }} >
        <Grid container spacing={2}>
          {myInfo.map((myI) => (
            <Grid item key={myI.id} xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography variant="h6">{myI.label}</Typography>
              <Typography variant="body1">{myI.value}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );

  const onSubmit = (e) => {
    e.preventDefault();
    handleOpen();

    let newconf = new DeviceSystemconfig();

    if (newDeviceName === "" || newDeviceName === undefined) {
      newconf.name = myInfo[3].value;
    } else {
      newconf.name = newDeviceName;
    }
    if (newPort === "" || newPort === undefined) {
      newconf.comport = myInfo[4].value;
    } else {
      newconf.comport = newPort;
    }
    if (newPasswordLocal === "" || newPasswordLocal === undefined) {
      newconf.password = myAppGlobal.systeminformations.Systemconfg.password;
    } else {
      newconf.password = newPasswordLocal;
    }

    newconf.deviceuniqid = myInfo[0].value;
    newconf.productmodel = myInfo[1].value;
    newconf.productname = myInfo[2].value;

    myAppGlobal.farmapi.setMyInfo(newconf).then((ret) => {
      if (ret) {
        if (ret.IsOK === true) {
          if (ret.retMessage === 'ok') {
            setModalTitle('데이터를 수정했습니다.')
            setModalDescription('빈 공간을 클릭해 창을 닫으십시오.')
          } else {
            setModalTitle('데이터를 수정하는데 실패했습니다.')
            setModalDescription('요청은 정상이였지만 데이터가 수정되지 않았습니다.')
          }
        }
      }
    })
  }

  const myNewInfo = (
    <Card sx={{ minWidth: 200, maxWidth: 'auto', m: 3 }}>
      <CardHeader
        title={t('ConfigurationInformation')}
      />
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch', },

        }}

        onSubmit={onSubmit}
        noValidate
        autoComplete="off"
      >
        <Grid container spacing={1}>
          {myNewInfoFrame.map((myNewI) => (
            <Grid item key={myNewI.id + "g"} xs={12} sm={12} md={12} lg={12} xl={12}>
              {getMyNewInfoFrame(myNewI)}

            </Grid>
          ))}
        </Grid>
        <Stack
          spacing={5}
          direction="row"
          justifyContent="center"
          sx={{ mt: 5, mb: 3 }}>
          <Button type="reset" variant="outlined" endIcon={<DeleteIcon />}>{t('Cancel')}</Button>
          <Button type="submit" variant="contained" endIcon={<SendIcon />}>{t('Submit')}</Button>
        </Stack>
      </Box>
    </Card>
  );

  function inputonchangeHandler(e) {
    switch (e.target.id) {
      case 'newAlias':
        newDeviceName = e.target.value;
        break;

      case 'newPort':
        newPort = e.target.value;
        break;

      case 'newPasswordLocal':
        newPasswordLocal = e.target.value;
        break;

      default:
        console.log('입력오류 발생');
    }
  }

  

  function frameUpdateInfo() {
    console.log('버전체크');
    let column1, column1_1, column2, column2_1, column3;
    column1 = t('DeviceVersion');
    column1_1 = deviceversion;

    if (myAppGlobal.islocal === true || myAppGlobal.islocal === "true") {
      column2 = t('WhenLocal');
      column3 = false
    } else {
      column2 = t('ServerVersion')
      column2_1 = serverversion
      if (deviceversion < serverversion) {
        column3 = false
      } else if (deviceversion === serverversion) {
        column3 = false
      }
    }

    return (
      <Stack
        spacing={0}
        direction="column"
        divider={<Divider orientation="horizontal" flexItem />}
        justifyContent="center"
        sx={{ mt: 5 }}>
        <Stack
          spacing={0}
          direction="row"
          justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ pl: 2 }}>{column1}</Typography>
          <Typography variant="body1" sx={{ pr: 2 }}>{column1_1}</Typography>
        </Stack>
        <Stack
          spacing={0}
          direction="row"
          justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ pl: 2 }}>{column2}</Typography>
          <Typography variant="subtitle1" sx={{ pl: 2 }}>{column2_1}</Typography>
        </Stack>
        <Button disabled={column3} onClick={updateServercode}>{t('Update')}</Button>
        <Button onClick={readdevicelog}>
          {t('LoadDeviceLog')}
        </Button>
      </Stack>
    )
  }

  function updateServercode(e) {
    console.log("updateServercode : " + e.target.name + "  serverversion:"+ serverversion);

  

    myAppGlobal.farmapi.setsoftwareupdate(true,2.216).then((ret) => {
      console.log(" setsoftwareupdate ret : " + ret.retMessage);
    });
  }

  function readdevicelog(e) {
    console.log("readdevicelog : " + e.target.name);
    myAppGlobal.farmapi.getdevicelog().then((ret) => {
      let devmlog = ret.retParam;
      console.log(" getdevicelg ret : " + ret);

      console.log(ret);

      //우선 콘솔에 출력하고 나중에 웹페이지에 구현하자
      devmlog.loglist.forEach((element) => {
        if (element != null) {
          console.log(element);
        }
      });
    });
  }

  function cardSystemSetting() {
    return (
      <Card sx={{ minWidth: 200, maxWidth: 'auto', m: 3 }}>
        <CardHeader
          title={t('SystemSetup')}
        />
        <Stack
        spacing={0}
        direction="column"
        divider={<Divider orientation="horizontal" flexItem />}
        justifyContent="center"
        sx={{ mt: 5 }}>
        <Stack
          spacing={0}
          direction="row"
          justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ pl: 2 }}>{t('CurrentDeviceTime')}</Typography>
          <Typography variant="body1" sx={{ pr: 2 }}>{deviceTime}</Typography>
        </Stack>
        </Stack>
      </Card>
    )
  }

  function cardUpdate() {
      return (
        <Card sx={{ minWidth: 200, maxWidth: 'auto', m: 3 }}>
          <CardHeader
            title={t('SoftwareUpdate')}
          />
          {frameUpdateInfo()}
        </Card>
      );
  }

  function cardInfo() {
    if (props.Systeminfo == null) {
      return <Box> nodata... </Box>
    }
    else {
      return (
        <Box>
          {myCurrentInfo}
          {myNewInfo}
          <Modal
            open={configureResult}
            onClose={handleClose}
            aria-labelledby="modal-configure-title"
            aria-describedby="modal-configure-description"
          >
            <Box sx={style}>
              <Typography id="modal-configure-title" variant="h6" component="h2">
                {modalTitle}
              </Typography>
              <Typography id="modal-configure-description" sx={{ mt: 2 }}>
                {modalDescription}
              </Typography>
            </Box>
          </Modal>
        </Box >
      );
    }
  }

  return (
    <Box>
      <ThemeProvider theme={theme}>
        <Typography variant="h1">{t('Setting')}</Typography>
        {cardSystemSetting()}
        {cardUpdate()}
        {cardInfo()}
      </ThemeProvider>
    </Box>
  );
}