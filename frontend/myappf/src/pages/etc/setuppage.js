import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { Box, Button, Card, CardContent, CardHeader, Divider, FormControl, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import CardActions from "@mui/material/CardActions";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import CircularProgress from "@mui/material/CircularProgress";
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

let newDevicename = "";
let oldpassword = "";
let newlocalpassword = "";
let newlangstrchange = "";
let isswupdateok=false;

export default function SetupPage(props) {
  const { i18n } = useTranslation();
  const [cookies, setCookie] = useCookies(["languageT"]);
  const [langstr, setlangstr] = React.useState("");
  const [deviceversion, setDeviceversion] = useState(0);
  const [serverversion, setServerversion] = useState(0);
  const [savedisable, setBtnDisable] = React.useState(true);
  const [savepwdisable, setBtnPWDisable] = React.useState(true);
  const [newpwdisable, setNewpwDisable] = React.useState(true);
  const [isupdating, setisupdate] = useState(false);


  const closeDialog = () => {
    setAlert(null);
  };

  let alertparams = {
    // type all the fields you need
    message: null,
    type: "success",
    title: "Sucess",
    onClose: closeDialog,
  };

  const [alertmssage, setAlert] = useState(alertparams);

  let isswupdate = false;

  function savemyconfig(newMyInfo) {
    myAppGlobal.farmapi.setMyInfo(newMyInfo).then((ret) => {
      let isok = false;
      if (ret) {
        if (ret.IsOK === true) {
          if (ret.retMessage === "ok") {
            isok = true;
          }
        }
      }
      if (isok === true) {
        alertparams.type = "success";
        alertparams.title = myAppGlobal.langT("LT_ALERT_SUCESS");
        alertparams.message = myAppGlobal.langT("LT_SETTING_SAVE_CONFIG");
        setAlert(alertparams);
      }
    });
  }

  function applyhandlerpw() {
    let newMyInfo = myAppGlobal.systeminformations.Systemconfg;

    newMyInfo.password = newlocalpassword;

    if (myAppGlobal.islocal == true) {
      savemyconfig(newMyInfo);
    }
    else
    {
      myAppGlobal.farmapi.setLoginPWServer(myAppGlobal.loginswid,newlocalpassword).then((ret) => {
        let isok = false;
        if (ret) {
          if (ret.IsOK === true) {
              isok = true;
          }
        }
        if (isok === true) {
          alertparams.type = "success";
          alertparams.title = myAppGlobal.langT("LT_ALERT_SUCESS");
          alertparams.message = myAppGlobal.langT("LT_SETTING_SAVE_CONFIG");
          setAlert(alertparams);
        }
      });

    }
    
  }

  function applyhandler() {
    if (i18n.language != newlangstrchange) {
      i18n.changeLanguage(newlangstrchange);
      var nextyear = new Date();
      nextyear.setFullYear(nextyear.getFullYear() + 2);
      setCookie("languageT", newlangstrchange, { expires: nextyear });
    }

    let isupdate = false;
    let newMyInfo = myAppGlobal.systeminformations.Systemconfg;
    if (newDevicename != myAppGlobal.systeminformations.Systemconfg.name && newDevicename.length > 0) {
      newMyInfo.name = newDevicename;
      isupdate = true;
    }

    if (isupdate == true) {
      savemyconfig(newMyInfo);
    }
  }

  useEffect(() => {
    //console.log("SetupPage  useEffect myAppGlobal.islocal: " + myAppGlobal.islocal);

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

  function swupdatecallback()
  {
    
    console.log(" swupdatecallback isswupdateok : " + isswupdateok); 
    if (isswupdateok === true) {
      alertparams.type = "success";
      alertparams.title = myAppGlobal.langT("LT_ALERT_SUCESS");
      alertparams.message = myAppGlobal.langT("LT_SETTING_SW_UPDATE_OK");
      
    }
    else
    {
      alertparams.type = "error";
      alertparams.title = myAppGlobal.langT("LT_ALERT_FAIL");
      alertparams.message = myAppGlobal.langT("LT_SETTING_SW_UPDATE_FAIL");
    }
    setAlert(alertparams);
    setisupdate(false);

  }

  function updateforlocaldevice(e) {
    //console.log("updateforlocaldevice : " + e.target.name + " serverversion:" + serverversion);

    setisupdate(true);
    isswupdateok=false;
    setTimeout(swupdatecallback, 12000); 
    myAppGlobal.farmapi.setsoftwareupdate(true, serverversion).then((ret) => {
      console.log(" setsoftwareupdate ret : " + ret.retMessage);

      if (ret) {
        if (ret.retMessage) {
          if (ret.retMessage === "ok") {
            isswupdateok = true;
          }
        }
      }
      
    

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

        <Button size="large"  disabled={isupdating} variant="contained" onClick={updateforlocaldevice} endIcon={isupdating===true?   <CircularProgress />:<UpgradeIcon />} sx={{ m:2 , backgroundColor: "#fb8c00" }} >
          {myAppGlobal.langT("Update") + "(" + serverversion + ")"}
        </Button>
      </Stack>
    );
  }

  function applycheck() {
    let isapplay = false;

    //console.log("-------------------------applycheck i18n.language:" + i18n.language + " newlangstrchange:" + newlangstrchange);
    if (newlangstrchange.length > 0 && i18n.language != newlangstrchange) {
      isapplay = true;
    }
    if (newDevicename != myAppGlobal.systeminformations.Systemconfg.name && newDevicename.length > 0) {
      isapplay = true;
    }

    setBtnDisable(!isapplay);
  }

  const handleChange = (event) => {
    setlangstr(event.target.value);

    if (event.target.value == 1) {
      newlangstrchange = "ko-KR";
    } else {
      newlangstrchange = "en-US";
    }

    applycheck();

    //console.log("-------------------------SetupPage cookies:" + cookies.languageT);
  };

  const handleNewpword = (e) => {
    //console.log("-------------------------handleNewpword name:" + e.target.id + ",pw:" + myAppGlobal.loginswpw);

    if (e.target.id == "oldpw") {
      oldpassword = e.target.value;
      if (oldpassword == myAppGlobal.loginswpw) {
        setNewpwDisable(false);
      } else {
        setNewpwDisable(true);
      }
    } else {
      newlocalpassword = e.target.value;

      if (newlocalpassword != myAppGlobal.loginswpw && newlocalpassword.length >= 4) {
        setBtnPWDisable(false);
      } else {
        setBtnPWDisable(true);
      }
    }
  };
  const handleNewname = (e) => {
    newDevicename = e.target.value;
    applycheck();
  };

  const loginpwblock = () => {
    //새로고침으로 사라짐
    //console.log("-------------------------loginpwblock pw:" + myAppGlobal.loginswpw);

    if (myAppGlobal.loginswpw.length < 2) {
      return (
        <Stack spacing={0} direction="column" alignItems="flex-start" sx={{ mt: 3 }}>
          <Typography id="modal-configure-title" variant="subtitle1">
            {myAppGlobal.langT("LT_CHANGEPASSWORD_RELOGIN")}
          </Typography>
        </Stack>
      );
    }

    return (
      <Stack spacing={0} direction="column" alignItems="flex-start" sx={{ mt: 3 }}>
        <Typography id="modal-configure-title" variant="subtitle1">
          {myAppGlobal.langT("LT_CHANGEPASSWORD")}
        </Typography>

        <TextField required id={"oldpw"} label={myAppGlobal.langT("LT_OLDPASSWORD")} type="text" variant="standard" onChange={handleNewpword} sx={{ width: 200, ml: 1, mt: 0, mb: 0, "& .MuiInputBase-input": { border: 0 } }} />
        <TextField required id={"newpw"} disabled={newpwdisable} label={myAppGlobal.langT("LT_NEWPASSWORD")} type="text" variant="standard" onChange={handleNewpword} sx={{ width: 200, ml: 1, mt: 0, mb: 0, "& .MuiInputBase-input": { border: 0 } }} />
        <Button onClick={applyhandlerpw} disabled={savepwdisable} size="large" variant="contained" endIcon={<LibraryAddCheckIcon />} sx={{ mt: 1, ml: 1, mb: 1, backgroundColor: "#fb8c00", width: 200 }}>
          {myAppGlobal.langT("LT_SETTING_MODAL_APPLYPW")}
        </Button>
      </Stack>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ maxWidth: 800 }}>
        <Box sx={{ ...commonStyles }}>
          <CardActions disableSpacing>
            <UpgradeIcon color="secondary" fontSize="medium" />
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
              <SettingsIcon color="secondary" fontSize="medium" />
              <Typography variant="h5">{myAppGlobal.langT("LT_SYSTEMSETUP")}</Typography>
            </CardActions>
          </ThemeProvider>
        </Box>

        <CardContent>
          <Box m={1} display="flex" alignItems="left" flexDirection="column">
            <Stack direction="column" alignItems="flex-start">
              <Typography id="modal-configure-title" variant="subtitle1">
                {myAppGlobal.langT("LT_CHANGELANGUAGE")}{" "}
              </Typography>

              <FormControl variant="standard" sx={{ ml: 1, width: 200 }}>
                <Select labelId="demo-simple-select-standard-label" id="demo-simple-select-standard" value={langstr} onChange={handleChange} label="language">
                  <MenuItem value={0}>English</MenuItem>
                  <MenuItem value={1}>한국어</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Stack spacing={0} direction="column" alignItems="flex-start" sx={{ mt: 3 }}>
              <Typography id="modal-configure-title" variant="subtitle1">
                {myAppGlobal.langT("LT_SETTING_NAME_CHANGE")}
              </Typography>

              <TextField
                required
                id={"newName"}
                label={myAppGlobal.langT("LT_SETTING_MODAL_NEWNAME_LABEL")}
                defaultValue={myAppGlobal.systeminformations.Systemconfg.name}
                type="text"
                variant="standard"
                onChange={handleNewname}
                sx={{ width: 200, ml: 1, mb: 3, "& .MuiInputBase-input": { border: 0 } }}
              />
            </Stack>

            <Button onClick={applyhandler} disabled={savedisable} size="large" variant="contained" endIcon={<LibraryAddCheckIcon />} sx={{ backgroundColor: "#fb8c00", maxWidth: 300 }}>
              {myAppGlobal.langT("LT_SETTING_MODAL_APPLY")}
            </Button>

            <Box sx={{ mt: 2, backgroundColor: "#eceff1" }}>{loginpwblock()}</Box>
          </Box>
        </CardContent>

        <Box sx={{ ...commonStyles }}>
          <ThemeProvider theme={theme}>
            <CardActions disableSpacing>
              <InfoIcon color="secondary" fontSize="medium" />
              <Typography variant="h5">{myAppGlobal.langT("LT_SETTING_MYDINFO_TITLE")}</Typography>
            </CardActions>
          </ThemeProvider>
        </Box>

        <Card variant="outlined" sx={{ borderRadius: 5, mt: 1, ml: 2, mr: 2, backgroundColor: "#eceff1" }}>
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
            <AlertDialog params={alertmssage} />
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
