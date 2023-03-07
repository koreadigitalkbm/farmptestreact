import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { Box, Button, Card, CardContent, CardHeader, Divider, FormControl, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import CardActions from "@mui/material/CardActions";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import IconButton from "@mui/material/IconButton";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "../muiTheme";
import myAppGlobal from "../../myAppGlobal";

import KDUtil from "../../commonjs/kdutil";
import CreateModal from "../pages/components/createModal";
import AlertDialog from "../uicomponent/basicalert";

const theme = muiTheme;

const commonStyles = {
  bgcolor: "background.paper",
  borderColor: "#82b1ff",
  m: 1,
  border: 1,
  minWidth: "40rem",
  borderRadius: "12px",
};

export default function SetupPage(props) {
  const { i18n } = useTranslation();
  const [cookies, setCookie] = useCookies(["languageT"]);
  const [langstr, setlangstr] = React.useState("");
  const [deviceversion, setDeviceversion] = useState(0);
  const [serverversion, setServerversion] = useState(0);

  const closeDialog = () => {
    setAlert(null);
  };


  let alertparams = {                   // type all the fields you need
    message:null,
    type:"success",
    title:"Sucess",
    onClose:closeDialog,
    };
  
  const [alertmssage, setAlert] = useState(alertparams);


  
  let isswupdate = false;
  let newDevicename = "";
  let newlocalpassword = "";


 
  



  function applyhandler() {
    let langstrchange = "en-US";

    if (langstr == 1) {
      langstrchange = "ko-KR";
    }

    if (i18n.language != langstrchange) {
      i18n.changeLanguage(langstrchange);
      var nextyear = new Date();
      nextyear.setFullYear(nextyear.getFullYear() + 2);
      setCookie("languageT", langstrchange, { expires: nextyear });
    }

    let isupdate = false;
    let newMyInfo = myAppGlobal.systeminformations.Systemconfg;
    if (newDevicename != myAppGlobal.systeminformations.Systemconfg.name && newDevicename.length > 0) {
      newMyInfo.name = newDevicename;
      isupdate = true;
    }
    if (newlocalpassword != myAppGlobal.systeminformations.Systemconfg.password && newlocalpassword.length > 0) {
      newMyInfo.password = newlocalpassword;
      isupdate = true;
    }

    if (isupdate == true) {
      console.log(newMyInfo);
      

      myAppGlobal.farmapi.setMyInfo(newMyInfo).then((ret) => {
        if (ret) {
          if (ret.IsOK === true) {
            if (ret.retMessage === "ok") {

              alertparams.type = "success";
              alertparams.title = myAppGlobal.langT("LT_ALERT_SUCESS");
              alertparams.message = myAppGlobal.langT("LT_SETTING_SAVE_CONFIG");
              setAlert(alertparams);


            } else {
            }
          }
        }
      });

    }
  }

  const handleChange = (event) => {
    setlangstr(event.target.value);

    console.log("-------------------------SetupPage cookies:" + cookies.languageT);
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
    } else {
      setlangstr(0);
    }
  }, []);

  if (serverversion > deviceversion && deviceversion > 0) {
    isswupdate = true;
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
          {myAppGlobal.langT("WhenLocal")}
        </Typography>
      );
    }

    if (isswupdate == false) {
      return (
        <Typography variant="subtitle1" sx={{ pl: 2 }}>
          {myAppGlobal.langT("LT_SETTING_NEW_VERSION")}
        </Typography>
      );
    }

    return (
      <Stack spacing={0} direction="column" divider={<Divider orientation="horizontal" flexItem />} justifyContent="center" sx={{ mt: 5 }}>
        <Stack spacing={0} direction="row" justifyContent="space-between">
          <Typography variant="subtitle1" sx={{ pl: 2 }}>
            {myAppGlobal.langT("LT_SETTING_NEW_UPDATE")}
          </Typography>
        </Stack>

        <Button onClick={updateforlocaldevice} endIcon={<UpgradeIcon />}>
          {myAppGlobal.langT("Update") + "(" + serverversion + ")"}
        </Button>
      </Stack>
    );
  }

  const handleNewpword = (e) => {
    if (e.target.value.length >= 4) {
      newlocalpassword = e.target.value;
    }
  };
  const handleNewname = (e) => {
    newDevicename = e.target.value;
  };
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
        <Box sx={{ ...commonStyles }}>
          <CardActions disableSpacing>
            <UpgradeIcon color="action" fontSize="large" />
            <Typography variant="h5">{myAppGlobal.langT("LT_SOFTWAREUPDATE")}</Typography>
          </CardActions>
        </Box>

        <CardContent>
          <Stack spacing={0} direction="row" justifyContent="space-between">
            <Typography variant="subtitle1" sx={{ pl: 2 }}>
              {" "}
              {myAppGlobal.langT("DeviceVersion")}{" "}
            </Typography>
            <Typography variant="body1" sx={{ pr: 2 }}>
              {deviceversion}
            </Typography>
          </Stack>

          {frameUpdateInfo()}
        </CardContent>

        <Box sx={{ ...commonStyles }}>
          <ThemeProvider theme={theme}>
            <CardActions disableSpacing>
              <SettingsIcon color="action" fontSize="large" />
              <Typography variant="h5">{myAppGlobal.langT("LT_SYSTEMSETUP")}</Typography>
            </CardActions>
          </ThemeProvider>
        </Box>

        <CardContent>
          <Box m={1} display="flex" alignItems="left" flexDirection="column">
            <Typography id="modal-configure-title" variant="subtitle1">
              {myAppGlobal.langT("LT_CHANGELANGUAGE")}{" "}
            </Typography>

            <FormControl variant="standard" sx={{ m: 1, width: 200 }}>
              <Select labelId="demo-simple-select-standard-label" id="demo-simple-select-standard" value={langstr} onChange={handleChange} label="language">
                <MenuItem value={0}>English</MenuItem>
                <MenuItem value={1}>한국어</MenuItem>
              </Select>
            </FormControl>

            <Typography id="modal-configure-title" variant="subtitle1">
              {myAppGlobal.langT("LT_CHANGEPASSWORD")}
            </Typography>

            <TextField
              required
              id={"newName"}
              label={"new password"}
              type="text"
              variant="standard"
              onChange={handleNewpword}
              sx={{
                width: 200,
                mt: 2,
                mb: 3,
                "& .MuiInputBase-input": {
                  border: 0,
                },
              }}
            />

            <Typography id="modal-configure-title" variant="subtitle1">
              {myAppGlobal.langT("LT_SETTING_NAME_CHANGE")}
            </Typography>

            <TextField
              required
              id={"newName"}
              label={myAppGlobal.langT("LT_SETTING_MODAL_NEWNAME_LABEL")}
              type="text"
              variant="standard"
              onChange={handleNewname}
              sx={{
                width: 200,
                mt: 2,
                mb: 3,
                "& .MuiInputBase-input": {
                  border: 0,
                },
              }}
            />

            <Button onClick={applyhandler} endIcon={<LibraryAddCheckIcon />}>
              {myAppGlobal.langT("LT_SETTING_MODAL_APPLY")}
            </Button>
          </Box>
        </CardContent>

        <Box sx={{ ...commonStyles }}>
          <ThemeProvider theme={theme}>
            <CardActions disableSpacing>
              <InfoIcon color="action" fontSize="large" />
              <Typography variant="h5">{myAppGlobal.langT("LT_SETTING_MYDINFO_TITLE")}</Typography>
            </CardActions>
          </ThemeProvider>
        </Box>

        <Card variant="outlined" sx={{ borderRadius: 5, mt: 1 }}>
          <CardContent>
            <Stack alignItems="center" direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
              <Typography variant="h7">{myAppGlobal.langT("LT_SETTING_NAME")}</Typography>
              <Typography>{myAppGlobal.systeminformations.Systemconfg.name}</Typography>
            </Stack>
            <hr />
            <Stack alignItems="center" direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
              <Typography variant="h7">{myAppGlobal.langT("LT_SETTING_DEVICEID")}</Typography>
              <Typography>{myAppGlobal.systeminformations.Systemconfg.deviceuniqid}</Typography>
            </Stack>
            <hr />
            <Stack alignItems="center" direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
              <Typography variant="h7">{myAppGlobal.langT("LT_SETTING_PRODUCTNAME")}</Typography>
              <Typography>{myAppGlobal.systeminformations.Systemconfg.productname}</Typography>
            </Stack>
            <hr />
            <Stack alignItems="center" direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
              <Typography variant="h7">{myAppGlobal.langT("LT_SETTING_PRODUCTMODEL")}</Typography>
              <Typography>{myAppGlobal.systeminformations.Systemconfg.productmodel}</Typography>
            </Stack>
            <AlertDialog  params={alertmssage}  />

            
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
