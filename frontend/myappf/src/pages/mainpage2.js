import React, { useState, useEffect } from "react";
import { Link as RouterLink, Routes, Route, useNavigate } from "react-router-dom";
import { AppBar, Box, Button, CssBaseline, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { Home, Logout, Menu as MenuIcon, QuestionMark, Settings, FindInPage, LocalFlorist } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import SetupPage from "./etc/setuppage";
import FactorySetup from "./etc/factorysetup";
import HDashboard from "./home/hdashboard";

import Autocontrolpage from "./control/autocontrolpage";
import myAppGlobal from "../myAppGlobal";
import DataMainPage from "./datas/datamain";
import AutocontrolTestpage from "./control/autotestp";

const dropMenu = ["Setting"];

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
      case "Autocontrol":
        return <LocalFlorist />;
      case "Data":
        return <FindInPage />;
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
          //console.log(ret);
          myAppGlobal.systeminformations = ret.retParam;
          
          //console.log("----------------------------systeminformations : " + myAppGlobal.systeminformations);

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
              if(ret.retParam ==null || ret.retParam.length < 0)
              {
                setLoadinfo("error");
              }
              else{

                
              myAppGlobal.Autocontrolcfg = ret.retParam;
              console.log("----------------------------Autocontrolcfg lenght : " + myAppGlobal.Autocontrolcfg.length);

              myAppGlobal.Autocontrolcfg.map(function (item) {
                if (item.Lid != null) {
                  item.Name = myAppGlobal.langT(item.Lid);
                }
              });
            }
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
        return  <div><CircularProgress  size="2rem"  /> <Typography>{myAppGlobal.langT("LT_LOADINGPAGE_INIT")}</Typography></div>;
      case "loadauto":
        return <div><CircularProgress  size="2rem"  /> <Typography>{myAppGlobal.langT("LT_LOADINGPAGE_LOADAUTO")}</Typography></div>;
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
        <Route path="/autocontrol" element={<Autocontrolpage />} />
        <Route path="/Data" element={<DataMainPage />} />

        <Route path="/Setting" element={props.loginrol === "factoryadmin" ? <FactorySetup {...props} /> : <SetupPage {...props} />} />
      </Routes>
    );
  }


  let NameT = myAppGlobal.langT("LT_MAINPAGE_NAV_BRAND");
  if (myAppGlobal.systeminformations != null) {
    if (myAppGlobal.systeminformations.Systemconfg.name != "unknown") {
      NameT = myAppGlobal.systeminformations.Systemconfg.name;
    }

  }

  return (
    <Box >
      <CssBaseline />

      <AppBar component="nav">
        <Toolbar>
          <img src="/image/farmscube_logo_small48.png" alt="farmscube_logo"></img>
          <Typography variant="h7" component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
            {NameT}
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
