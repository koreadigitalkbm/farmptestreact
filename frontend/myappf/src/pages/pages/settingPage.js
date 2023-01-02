import React, { useState, useEffect } from "react"

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack'
import Divider from "@mui/material/Divider";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';
import { ThemeProvider } from '@mui/material/styles'

import muiTheme from './../muiTheme';
import myAppGlobal from "../../myAppGlobal"

import DeviceSystemconfig from "../../commonjs/devsystemconfig"

const theme = muiTheme

export default function SettingPage(props) {
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

    if (deviceversion < serverversion) {
      setIsLatest('최신 업데이트가 있습니다.');
    } else if (deviceversion === serverversion) {
      setIsLatest('현재 최신버전입니다.');
    } else {
      setIsLatest('서버보다 버전이 높습니다.');
    }

    if (props.Systeminfo != null) {
      setMyInfo([
        {
          id: 'currentDeviceId',
          label: '기기ID',
          value: myAppGlobal.systeminformations.Systemconfg.deviceuniqid
        },
        {
          id: 'currentModelName',
          label: '모델명',
          value: myAppGlobal.systeminformations.Systemconfg.productmodel
        },
        {
          id: 'currentBrandName',
          label: '브랜드명',
          value: myAppGlobal.systeminformations.Systemconfg.productname
        },
        {
          id: 'currentAlias',
          label: '기기닉네임',
          value: myAppGlobal.systeminformations.Systemconfg.name
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
          type: 'text'
        },
        {
          id: 'newPasswordLocal',
          label: '새 로컬 비밀번호',
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
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch', },

      }}

      onSubmit={onSubmit}
      noValidate
      autoComplete="off"
    >
      <Typography variant="h3" sx={{ mb: 2 }}>정보 수정</Typography>
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
        sx={{ mt: 5 }}>
        <Button type="reset" variant="outlined" endIcon={<DeleteIcon />}>취소</Button>
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>수정하기</Button>
      </Stack>
    </Box>

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

  function updateServercode(e) {
    console.log("updateServercode : " + e.target.name);

    myAppGlobal.farmapi.setsoftwareupdate(false).then((ret) => {
      console.log(" setsoftwareupdate ret : " + ret.retMessage);
    });
  }

  function updateLocalDevice(e) {
    console.log("updateLocalDevice : " + e.target.name);

    myAppGlobal.farmapi.setsoftwareupdate(true).then((ret) => {
      console.log(" setsoftwareupdate ret : " + ret.retMessage);
    });
  }

  function frameUpdateInfo() {
    console.log('버전체크');
    console.log(deviceversion);
    console.log(serverversion);
    let column1, column1_1, column2, column3;
    if(myAppGlobal.islocal === true || myAppGlobal.islocal === "true") {
      column1 = "장비버전: " + deviceversion;
      column2 = 
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
            {column1}
          <Typography variant="h6" align='left' sx={{ pl: 1}}>{column1}</Typography>
          <Typography variant="body1" align="right" sx={{ pr: 1 }}>{column1_1}</Typography>
        </Stack>
        <Button className="" onClick={readdevicelog}>
          장비로그 가져오기
        </Button>
      </Stack>
    )
  }

  function boardUpdate() {
    if (myAppGlobal.islocal === true) {
      return (
        <Card sx={{ minWidth: 200, maxWidth: 'auto', m: 3 }}>
          <CardHeader
            title={'소프트웨어 업데이트'}
          />
          {frameUpdateInfo()}
        </Card>
        /*
        <Box>
          <Typography>about Page..1111 {myAppGlobal.logindeviceid} </Typography>
          장비버전 : {devcieversion}
          <Box>
            <Button className="" onClick={readdevicelog}>
              {" "}
              장비로그 가져오기{" "}
            </Button>
          </Box>
        </Box>
      );
    } else {
      if (loginrole === "admin") {
        return (
          <Box>
            <Typography
              variant="h2">
              about Page..2222 {myAppGlobal.logindeviceid}
            </Typography>
            <div>서버버전 : {serverversion}</div>
            <div>
              <button className="" onClick={updateServercode}>
                {" "}
                서버 업데이트{" "}
              </button>
            </div>
            <div>
              <button className="" onClick={readdevicelog}>
                {" "}
                장비로그 가져오기{" "}
              </button>
            </div>
          </Box>
        );
      } else {
        return (
          <Box>
            <div>장비버전 : {devcieversion}</div>
            <div>업데이트버전 : {serverversion}</div>
            <div>
              {isupdate ? (
                <button className="" onClick={updateLocalDevice}>
                  {" "}
                  업데이트 테스트{" "}
                </button>
              ) : (
                "최신버전 입니다."
              )}
            </div>
            <div>
              <button className="" onClick={readdevicelog}>
                {" "}
                장비로그 가져오기{" "}
              </button>
            </div>

          </Box>
          */
      );
    }
  }

  function initPage() {
    if (props.Systeminfo == null) {
      return <Box> nodata... </Box>
    }
    else {
      return (
        <Box align="center">
          <Typography variant="h1">설정페이지</Typography>
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
        {boardUpdate()}
        {initPage()}
      </ThemeProvider>
    </Box>
  );
}