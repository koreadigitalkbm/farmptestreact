import React, { useState, useEffect } from "react";

import { Box, Button, Card, CardContent, CardHeader, Divider, Modal, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "./muiTheme";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import myAppGlobal from "../myAppGlobal";

import { useTranslation } from "react-i18next";
import { useCookies } from 'react-cookie';
import KDUtil from "../commonjs/kdutil";

const theme = muiTheme;

const commonStyles = {
  bgcolor: "background.paper",
  borderColor: "info.main",
  m: 1,
  border: 1,
  width: "50rem",
  height: "5rem",
};

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const modalStyle = {
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

export default function SetupPage(props) {
  const { t, i18n } = useTranslation();
  const [cookies, setCookie] = useCookies(['languageT']);
  const [langstr, setlangstr] = React.useState('');
  const [deviceversion, setDeviceversion] = useState(0);
  const [serverversion, setServerversion] = useState(0);
  const [expanded, setExpanded] = React.useState(false);

  const [configureResult, setConfigureResult] = useState(false);
  const handleOpen = () => setConfigureResult(true);
  const handleClose = () => setConfigureResult(false);
  let isupdate = false;

  const handleChange = (event) => {
    setlangstr(event.target.value);
    let langstr = "en-US";
    if (event.target.value == 0) {

    }
    else {
      langstr = "ko-KR";
    }
    langstr = KDUtil.isSupportLanguage(langstr);
    i18n.changeLanguage(langstr);
    var nextyear = new Date();
    nextyear.setFullYear(nextyear.getFullYear() + 2);
    setCookie('languageT', langstr, { expires: nextyear });
    console.log("-------------------------SetupPage cookies:" + cookies.languageT);

  };


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {

    console.log("SetupPage  useEffect myAppGlobal.islocal: " + myAppGlobal.islocal);



    if (myAppGlobal.islocal === false || myAppGlobal.islocal === "false") {
      if (serverversion == 0) {
        myAppGlobal.farmapi.getdeviceversion(true).then((ret) => {
          console.log(" get server version ret : " + ret.retMessage);
          setServerversion(ret.retMessage);
        });
      }
    }

    if (deviceversion == 0) {
      myAppGlobal.farmapi.getdeviceversion(false).then((ret) => {
        console.log("getdevice version ret1 : " + ret.retMessage);
        setDeviceversion(ret.retMessage);
      });
    }

    if (i18n.language === "ko-KR") {
      setlangstr(1);
    }
    else {
      setlangstr(0);
    }



  });




  if (serverversion >= deviceversion && deviceversion > 0) {
    isupdate = true;
  }



  function updateforlocaldevice(e) {
    console.log("updateforlocaldevice : " + e.target.name + " serverversion:" + serverversion);

    
    myAppGlobal.farmapi.setsoftwareupdate(true, serverversion).then((ret) => {
      console.log(" setsoftwareupdate ret : " + ret.retMessage);
    });
  }

  function frameUpdateInfo() {
    console.log("버전체크");

    if (myAppGlobal.islocal === true || myAppGlobal.islocal === "true") {
      return (
        <Typography variant="subtitle1" sx={{ pl: 2 }}>
          {t("WhenLocal")}
        </Typography>
      );
    }

    if (isupdate == false) {
      return (
        <Typography variant="subtitle1" sx={{ pl: 2 }}>
          최신버전입니다.
        </Typography>
      );
    }

    return (
      <Stack spacing={0} direction="column" divider={<Divider orientation="horizontal" flexItem />} justifyContent="center" sx={{ mt: 5 }}>
        <Stack spacing={0} direction="row" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ pl: 2 }}>
            새로운 버전이 있습니다. 업데이트를 진행하세요.{" "}
          </Typography>
        </Stack>

        <Button onClick={updateforlocaldevice} endIcon={<UpgradeIcon />}>
          {t("Update") + "(" + serverversion + ")"}
        </Button>
      </Stack>
    );
  }

  function inputonchangeHandler(e) {
    console.log("inputallchangeHandler name: " + e.target.id + " type : " + e.target.type);
    switch (e.target.id) {
      default:
        // newconfig[e.target.id] = e.target.value;
        break;
    }
  }



  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Typography id="setting_title" variant="h2" sx={{ mt: 4, mb: 5 }}>{myAppGlobal.langT("LT_SETTING_TITLE")}</Typography>
        <Box sx={{ ...commonStyles, borderRadius: "16px" }}>
          <ThemeProvider theme={theme}>
            <CardActions disableSpacing>
              <UpgradeIcon color="action" fontSize="large" />
              <Typography variant="h5">{t("LT_SOFTWAREUPDATE")}</Typography>

              <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
                <ExpandMoreIcon color="success" fontSize="large" />
              </ExpandMore>
            </CardActions>
          </ThemeProvider>

        </Box>
        {(expanded === true) ? (<Container maxWidth="sm" >          <Box sx={{ bgcolor: "#cfe8fc", height: "50vh" }} />        </Container>) : null}

        <Stack spacing={0} direction="row" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ pl: 2 }}>   {t("DeviceVersion")}   </Typography>
          <Typography variant="body1" sx={{ pr: 2 }}>
            {deviceversion}
          </Typography>
        </Stack>
        {frameUpdateInfo()}


        <Box sx={{ ...commonStyles, borderRadius: "16px" }}>
          <ThemeProvider theme={theme}>
            <CardActions disableSpacing>
              <UpgradeIcon color="action" fontSize="large" />
              <Typography variant="h5">{t("LT_SYSTEMSETUP")}</Typography>


            </CardActions>
          </ThemeProvider>


        </Box>

        <Typography id="modal-configure-title" variant="h6" component="h2">{t("LT_CHANGELANGUAGE")} </Typography>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={langstr}
            onChange={handleChange}
            label="language"
          >
            <MenuItem value={0}>English</MenuItem>
            <MenuItem value={1}>한국어</MenuItem>

          </Select>
        </FormControl>

        <Typography id="modal-configure-title" variant="h6" component="h2">{t("LT_CHANGEPASSWORD")}</Typography>
        <TextField id="password" defaultValue={1234} type="text" variant="outlined" onChange={inputonchangeHandler} sx={{ "& .MuiOutlinedInput-input": { border: 0 } }} />

        <Card secondary sx={{ mt: 2 }}>
          <CardHeader title={myAppGlobal.langT("LT_SETTING_MYDINFO_TITLE")} />

          <CardContent>

            <Button color={"primary"} onClick={handleOpen} variant="contained">테스트중2</Button>
            <Typography variant="h6">{myAppGlobal.langT("LT_SETTING_NAME")}</Typography>
            {myAppGlobal.systeminformations.Systemconfg.name}
            <Typography variant="h6">{myAppGlobal.langT("LT_SETTING_DEVICEID")}</Typography>
            {myAppGlobal.systeminformations.Systemconfg.deviceuniqid}
            <Typography variant="h6">{myAppGlobal.langT("LT_SETTING_COMPORT")}</Typography>
            {myAppGlobal.systeminformations.Systemconfg.comport}
            <Typography variant="h6">{myAppGlobal.langT("LT_SETTING_PRODUCTNAME")}</Typography>
            {myAppGlobal.systeminformations.Systemconfg.productname}
            <Typography variant="h6">{myAppGlobal.langT("LT_SETTING_PRODUCTMODEL")}</Typography>
            {myAppGlobal.systeminformations.Systemconfg.productmodel}
            <Modal
              open={configureResult}
              onClose={handleClose}
              aria-labelledby="modal-configure-title"
              aria-describedby="modal-configure-description"
            >
              <Box sx={modalStyle}>
                <Typography id="modal-configure-title" variant="h6" component="h2">
                  {myAppGlobal.langT('LT_SETTING_MODAL_TITLE')}
                </Typography>
                <Typography id="modal-configure-description" sx={{ mt: 2 }}>
                  {myAppGlobal.langT('LT_SETTING_MODAL_DESCRIPTION')}
                </Typography>
              </Box>
            </Modal>
          </CardContent>
        </Card>

        {console.log(myAppGlobal.systeminformations.Systemconfg)}
      </Box>
    </ThemeProvider>
  );
}
