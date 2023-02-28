import React, { useState, useEffect } from "react";
import { Link as RouterLink, Routes, Route, useNavigate } from "react-router-dom";
import { AppBar, Box, Button, CssBaseline, Menu, MenuItem, Toolbar, Typography, IconButton } from "@mui/material";
import { Dataset, Home, Logout, Menu as MenuIcon, QuestionMark, Settings, FindInPage, LocalFlorist } from "@mui/icons-material";

import HomePage from "./HomePage";
import ControlPage from "./pages/controlPage";
import DataPage from "./pages/dataPage";
import SettingPage from "./pages/settingPage";

import SetupPage from "./setuppage";
import FactorySetup from "./factorysetup";
import HDashboard from "./home/hdashboard";

import Autocontrolpage from "./control/autocontrolpage";
import myAppGlobal from "../myAppGlobal";
import DataMainPage from "./datas/datamain";

const dropMenu = ["Data2", "Setting", "Sensor", "Control", "Setup"];

export default function FMainpage(props) {
  const [loadinfo, setLoadinfo] = useState("init");

  const [dropItems, setDropItems] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const open = Boolean(anchorEl);
  console.log("-------------------------FMainpage --------------------- loginrol:" + props.loginrol);

  function logoutbuttonHandler(e) {
    props.mhandler(null, null);
  }

  function handleNavmenu(e) {
    setAnchorEl(e.currentTarget);
  }

  function handleNavmenuClose() {
    setAnchorEl(null);
  }

  function Navicon(props) {
    switch (props.id) {
      case "Home":
        return <Home />;
      case "Data":
        return <FindInPage />;
      case "Autocontrol":
        return <LocalFlorist />;
      case "Setting":
        return <Settings />;
      case "Logout":
        return <Logout />;

      default:
        return <QuestionMark />;
    }
  }

  useEffect(() => {
    let dropItems = {};
    dropMenu.map((e) => (dropItems[e] = myAppGlobal.langT(e)));
    setDropItems(dropItems);

    // 로그인되면 무조건 홈화면으로 가게
    navigate("/");

    console.log("-------------------------FMainpage --------------------- useEffect:");

    if (myAppGlobal.systeminformations == null) {
      myAppGlobal.farmapi.getSysteminformations().then((ret) => {
        if (ret == null) {
          setLoadinfo("error");
        } else {
          console.log(ret);
          myAppGlobal.systeminformations = ret.retParam;
          console.log("----------------------------systeminformations : " + myAppGlobal.systeminformations);

          if (props.loginrol === "factoryadmin") {
            //공장설정 계정이면 자동제어필요 없이 바로 설정되도록 건너뜀.
            setLoadinfo("loadok");
          } else {
            setLoadinfo("loadauto");
          }

          myAppGlobal.farmapi.getAutocontrolconfig().then((ret) => {
            if (ret == null) {
              //자동제어가 없다. 이럴경우 어케하지..
              setLoadinfo("error");
            } else {
              myAppGlobal.Autocontrolcfg = ret.retParam;
              myAppGlobal.Autocontrolcfg.map(function (item) {
                if (item.Lid != null) {
                  item.Name = myAppGlobal.langT(item.Lid);
                }
              });
            }
            setLoadinfo("loadok");
          });
        }

        //props.onSetSysteminfo("set info");
      });
    }
  }, []);

  function loadpage() {
    console.log("---------------------------- loadpage loadinfo: " + loadinfo);
    switch (loadinfo) {
      case "init":
        return <Typography>{myAppGlobal.langT("LT_LOADINGPAGE_INIT")}</Typography>;
      case "loadauto":
        return <Typography>{myAppGlobal.langT("LT_LOADINGPAGE_LOADAUTO")}</Typography>;
      case "error":
        return <Typography>{myAppGlobal.langT("LT_LOADINGPAGE_ERROR")}</Typography>;
      case "otherlogin":
        return <Typography>{myAppGlobal.langT("LT_LOADINGPAGE_OTHLOGIN")}</Typography>;
      default:
        break;
    }

    return (
      <Routes>
        <Route path="/" element={<HDashboard otherlogin={setLoadinfo} />} />
        <Route path="/Home" element={<HDashboard otherlogin={setLoadinfo} />} />
        <Route path="/Control" element={<ControlPage />} />
        <Route path="/Data" element={<DataMainPage />} />
        <Route path="/Data2" element={<DataPage />} />
        <Route path="/Setting" element={<SettingPage />} />

        <Route path="/autocontrol" element={<Autocontrolpage />} />
        <Route path="/setup" element={props.loginrol === "factoryadmin" ? <FactorySetup {...props} /> : <SetupPage {...props} />} />
      </Routes>
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar component="nav">
        <Toolbar>
          <img src="/image/farmscube_logo_small48.png"></img>

          <Typography variant="h7" component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
            &nbsp;
            {myAppGlobal.langT("LT_MAINPAGE_NAV_BRAND")}
            &nbsp; : &nbsp;
            {/* {myAppGlobal.systeminformations.Systemconfg.name} */}
          </Typography>

          <Button component={RouterLink} to={"Home"} color="inherit">
            <Home />
            {myAppGlobal.langT("Home")}
          </Button>
          <Button component={RouterLink} to={"Autocontrol"} color="inherit">
            <LocalFlorist />
            {myAppGlobal.langT("Autocontrol")}
          </Button>
          <Button component={RouterLink} to={"Data"} color="inherit">
            <FindInPage />
            {myAppGlobal.langT("Data")}
          </Button>

          <Button id="nav-dropmenu-button" aria-controls={open ? "nav-dropmenu-list" : undefined} aria-haspopup="true" aria-expanded={open ? "true" : undefined} variant="contained" disableElevation onClick={handleNavmenu} endIcon={<MenuIcon />} />
          <Menu
            elevation={0}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            id="nav-dropmenu-list"
            MenuListProps={{
              "aria-labelledby": "nav-dropmenu-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleNavmenuClose}
          >
            {dropMenu.map((item) => (
              <MenuItem component={RouterLink} key={item} to={item} onClick={handleNavmenuClose}>
                <Navicon id={item} />
                &nbsp;{dropItems[item]}
              </MenuItem>
            ))}
            <MenuItem onClick={logoutbuttonHandler}>
              <Navicon id="Logout" />
              &nbsp;{myAppGlobal.langT("SignOut")}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ mx: "auto", p: 1 }}>
        <Toolbar />
        {loadpage()}
      </Box>
    </Box>
  );
}
