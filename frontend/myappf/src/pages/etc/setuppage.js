import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCookies } from "react-cookie";
import { Box, Button, Card, CardContent,  Divider, FormControl, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";


import CardActions from "@mui/material/CardActions";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import CircularProgress from "@mui/material/CircularProgress";

import UpgradeIcon from "@mui/icons-material/Upgrade";
import SettingsIcon from "@mui/icons-material/Settings";
import InfoIcon from "@mui/icons-material/Info";
import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "../muiTheme";
import myAppGlobal from "../../myAppGlobal";


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
let isswupdateok = false;
let isswupdate = null;
let newTimezonechange = Number(0);
let istimezoneupdate = false;
let newMonitorPassword = "";

const SetupPage = () => {
  const { i18n } = useTranslation();
  const [cookies, setCookie] = useCookies(["languageT"]);
  const [langstr, setlangstr] = React.useState("");
  const [timezonevalue, setTimezone] = useState(0);
  const [deviceversion, setDeviceversion] = useState(0);
  const [serverversion, setServerversion] = useState(0);
  const [savedisable, setBtnDisable] = React.useState(true);
  const [savepwdisable, setBtnPWDisable] = React.useState(true);
  const [newpwdisable, setNewpwDisable] = React.useState(true);
  const [isupdating, setisupdate] = useState(false);
  const [saveMonitorPwDisable, setSaveMonitorPwDisable] = React.useState(true);

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
        if (istimezoneupdate == true) {
          alertparams.message = myAppGlobal.langT("LT_SETTING_SAVE_TIMEZON_CONFIG");
        } else {
          alertparams.message = myAppGlobal.langT("LT_SETTING_SAVE_CONFIG");
        }

        setAlert(alertparams);
      }
    });
  }

  function applyhandlerpw() {
    let newMyInfo = myAppGlobal.systeminformations.Systemconfg;

    newMyInfo.password = newlocalpassword;

    if (myAppGlobal.islocal == true) {
      savemyconfig(newMyInfo);
    } else {
      myAppGlobal.farmapi.setLoginPWServer(myAppGlobal.loginswid, newlocalpassword).then((ret) => {
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
    let isupdate = false;
    let newMyInfo = myAppGlobal.systeminformations.Systemconfg;

    if (i18n.language != newlangstrchange) {
      //console.log("applyhandler new  language: " + newlangstrchange);

      i18n.changeLanguage(newlangstrchange);
      var nextyear = new Date();
      nextyear.setFullYear(nextyear.getFullYear() + 2);
      setCookie("languageT", newlangstrchange, { expires: nextyear });
      newMyInfo.language = newlangstrchange;
      isupdate = true;
    }

    if (newDevicename != myAppGlobal.systeminformations.Systemconfg.name && newDevicename.length > 0) {
      newMyInfo.name = newDevicename;
      isupdate = true;
    }

    istimezoneupdate = false;
    if (newTimezonechange != myAppGlobal.systeminformations.Systemconfg.timezoneoffsetminutes) {
      newMyInfo.timezoneoffsetminutes = newTimezonechange;
      //console.log("applyhandler new  timezoneoffsetminutes: " + newMyInfo.timezoneoffsetminutes);

      isupdate = true;
      istimezoneupdate = true;
    }

    if (isupdate == true) {
      //console.log("applyhandler new  timezoneoffsetminutes: " + newMyInfo.timezoneoffsetminutes);
      //console.log("applyhandler new  name: " + newMyInfo.name);
      //console.log("applyhandler new  language: " + newMyInfo.language);

      savemyconfig(newMyInfo);
    }
  }

  useEffect(() => {
    console.log("SetupPage  useEffect timezoneoffsetminutes: " + myAppGlobal.systeminformations.Systemconfg.timezoneoffsetminutes);

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

    newTimezonechange = myAppGlobal.systeminformations.Systemconfg.timezoneoffsetminutes;
    setTimezone(myAppGlobal.systeminformations.Systemconfg.timezoneoffsetminutes);
  }, []);

  if (serverversion > deviceversion && deviceversion > 0) {
    isswupdate = true;
  } else {
    isswupdate = false;
  }

  function swupdatecallback() {
    console.log(" swupdatecallback isswupdateok : " + isswupdateok);
    if (isswupdateok === true) {
      alertparams.type = "success";
      alertparams.title = myAppGlobal.langT("LT_ALERT_SUCESS");
      alertparams.message = myAppGlobal.langT("LT_SETTING_SW_UPDATE_OK");
    } else {
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
    isswupdateok = false;
    setTimeout(swupdatecallback, 30000);
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

  function settimezoneui() {
    console.log("settimezone deviceversion : " + deviceversion);

    if (deviceversion < 2.24) {
      return null;
    }

    return (
      <Stack direction="column" alignItems="flex-start">
        <Typography id="modal-configure-title" variant="subtitle1">
          {myAppGlobal.langT("LT_CHANGE_TIMEZONE")}{" "}
        </Typography>

        <FormControl variant="standard" sx={{ ml: 1, width: 200 }}>
          <Select labelId="demo-simple-select-standard-label" id="demo-simple-select-standard" value={timezonevalue} onChange={handleChangetimezone} label="language">
            <MenuItem value={0}>Europe/London</MenuItem>
            <MenuItem value={540}>Asia/Seoul</MenuItem>
            <MenuItem value={-600}>US/Hawaii</MenuItem>
            <MenuItem value={-540}>US/Hawaii-Aleutain</MenuItem>
            <MenuItem value={-480}>US/Alaska</MenuItem>
            <MenuItem value={-420}>US/Pacific</MenuItem>
            <MenuItem value={-360}>US/Mountain</MenuItem>
            <MenuItem value={-300}>US/Central</MenuItem>
            <MenuItem value={-240}>US/Eastern </MenuItem>
          </Select>
        </FormControl>
      </Stack>
    );
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
    if (isswupdate == null || deviceversion == 0) {
      return <CircularProgress />;
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

        <Button size="large" disabled={isupdating} variant="contained" onClick={updateforlocaldevice} endIcon={isupdating === true ? <CircularProgress /> : <UpgradeIcon />} sx={{ m: 2, backgroundColor: "#fb8c00" }}>
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

    if (newTimezonechange != myAppGlobal.systeminformations.Systemconfg.timezoneoffsetminutes) {
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

  const handleChangetimezone = (event) => {
    newTimezonechange = Number(event.target.value);
    setTimezone(newTimezonechange);

    console.log("-------------------------handleChangetimezone:" + newTimezonechange);

    applycheck();
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

  const handleMonitorPassword = (e) => {
    newMonitorPassword = e.target.value;
    if (newMonitorPassword.length >= 4) {
      setSaveMonitorPwDisable(false);
    } else {
      setSaveMonitorPwDisable(true);
    }
  };

  function applyMonitorPasswordHandler() {
    let newMyInfo = myAppGlobal.systeminformations.Systemconfg;
    newMyInfo.monitorPassword = newMonitorPassword;

    if (myAppGlobal.islocal == true) {
      savemyconfig(newMyInfo);
    } else {
      myAppGlobal.farmapi.setLoginPWServerViewer(myAppGlobal.loginswid, newMonitorPassword).then((ret) => {
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

  const monitorPasswordBlock = () => {
    //로컬 접속시 암호 변경 불가
    if (myAppGlobal.islocal === true || myAppGlobal.islocal === "true" || deviceversion < 2.3) {
      return null;
    }

    return (
      <Box sx={{ mt: 5, backgroundColor: "white", p: 1 }}>
        <Stack spacing={0} direction="column" alignItems="flex-start" sx={{ backgroundColor: "#f5f5f5", p: 2, borderRadius: 1 }}>
          <Typography id="modal-configure-title" variant="subtitle1">
            {myAppGlobal.langT("LT_MONITOR_PASSWORD")}
          </Typography>
          <TextField required id="monitorPassword" label={myAppGlobal.langT("LT_NEWPASSWORD")} type="password" variant="standard" onChange={handleMonitorPassword} sx={{ width: 200, ml: 1, mt: 0, mb: 0, "& .MuiInputBase-input": { border: 0 } }} />
          <Button onClick={applyMonitorPasswordHandler} disabled={saveMonitorPwDisable} size="large" variant="contained" endIcon={<LibraryAddCheckIcon />} sx={{ mt: 1, ml: 1, mb: 1, backgroundColor: "#fb8c00", width: 200 }}>
            {myAppGlobal.langT("LT_SETTING_MODAL_APPLYPW")}
          </Button>
        </Stack>
      </Box>
    );
  };

  if (myAppGlobal.isuseradmin === false) {
    return (
      <Stack spacing={0} direction="row" justifyContent="space-between">
       
                <VisibilityIcon color="action" />
                <Typography variant="body2" color="text.secondary">
                  {myAppGlobal.langT("LT_READONLYMODE")}
                  {myAppGlobal.langT("LT_SYSTEMSETUP_NOT_ADMIN")}
                </Typography>
       

      
      </Stack>
    );
  }

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
            {settimezoneui()}

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

            <Box sx={{ mt: 2, backgroundColor: "#eceff1" }}>
              {loginpwblock()}
              {monitorPasswordBlock()}
            </Box>
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
};

export default SetupPage;
