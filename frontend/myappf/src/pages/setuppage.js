import React, { useState, useEffect } from "react";

import { Box, Button, Card, CardHeader, Divider, Modal, Stack, TextField, Typography } from "@mui/material";
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

export default function SetupPage(props) {
    const { t, i18n } = useTranslation();
  const [langstr, setlangstr] = React.useState('');
  const [deviceversion, setDeviceversion] = useState(0);
  const [serverversion, setServerversion] = useState(0);
  const [expanded, setExpanded] = React.useState(false);
  let isupdate = false;

  const handleChange = (event) => {
    setlangstr(event.target.value);
    if(event.target.value ==0)
    {
        i18n.changeLanguage("en-US");
    }
    else{
        i18n.changeLanguage("ko-KR");  
    }

  };


  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {

    console.log("SetupPage  useEffect myAppGlobal.islocal: " + myAppGlobal.islocal);

  

    if (myAppGlobal.islocal === false || myAppGlobal.islocal === "false") {
      if(serverversion==0 )
      {
      myAppGlobal.farmapi.getdeviceversion(true).then((ret) => {
        console.log(" get server version ret : " + ret.retMessage);
        setServerversion(ret.retMessage);
      });
    }
    }

    if(deviceversion==0 )
    {
    myAppGlobal.farmapi.getdeviceversion(false).then((ret) => {
      console.log("getdevice version ret1 : " + ret.retMessage);
      setDeviceversion(ret.retMessage);
    });
  }

    if (i18n.language === "ko-KR")
    {
        setlangstr(1);
    }
    else{
        setlangstr(0);
    }
  
    

  });




  if (serverversion >= deviceversion && deviceversion > 0) {
    isupdate = true;
  }

  

  function updateServercode(e) {
    console.log("updateServercode : " + e.target.name);

    myAppGlobal.farmapi.setsoftwareupdate(false).then((ret) => {
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

        <Button onClick={updateServercode} endIcon={<UpgradeIcon />}>
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
    <div>
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
        <Container maxWidth="sm" sx={expanded == true ? { visibility: "hidden" } : { visibility: "visible" }}>
          <Box sx={{ bgcolor: "#cfe8fc", height: "100vh" }} />
        </Container>
      </Box>
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

      <Typography id="modal-configure-title" variant="h6" component="h2">{t("LT_CHANGEPASSWORD") }</Typography>
          <TextField id="password" defaultValue={1234} type="text" variant="outlined" onChange={inputonchangeHandler} sx={{ "& .MuiOutlinedInput-input": { border: 0 } }} />
    </div>
  );
}
