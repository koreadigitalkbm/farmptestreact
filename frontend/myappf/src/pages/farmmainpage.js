
import React, { useState, useEffect } from "react";
import { BrowserRouter, Link as RouterLink, Routes, Route } from "react-router-dom";
import { AppBar, Box, Button, colors, CssBaseline, Divider, Drawer, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material';

import { Menu, Language } from '@mui/icons-material';

import About from "./about";
import HomePage from "./HomePage";
import ControlPage from "./pages/controlPage";
import DataPage from "./pages/dataPage";
import SettingPage from "./pages/settingPage";

import AdminSetup from "./adminsetup";
import Sensorpage from "./sensorpage";
import Devicepage from "./devicepage";
import Autocontrolpage from "./control/autocontrolpage";

import myAppGlobal from "../myAppGlobal";

import { useTranslation } from "react-i18next";

const drawerWidth = 240;

export default function FarmMainpage(props) {
  console.log("-------------------------FarmMainpage ---------------------LoginRole : " + props.LoginRole + " , window: " + window);
  const { t, i18n } = useTranslation();

  const navItems = [t('Home'), t('Sensor'), t('Control'), t('Autocontrol'), t('Data'), t('Setting'), t('Setup'),];

  const [mobileOpen, setMobileOpen] = useState(false);


  const handleDrawerToggle = () => {
    // setMobileOpen((prevState) => !prevState);
  };

  function handleClickChangeLanguage() {
    if(i18n.language === 'ko-KR'){
      i18n.changeLanguage('en-US');
    } else {
      i18n.changeLanguage('ko-KR');
    }
  }



  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  //const container = window !== undefined ? () => window().document.body : undefined;

  function logoutbuttonHandler(e) {
    window.sessionStorage.setItem("login", "logout");
    window.sessionStorage.setItem("deviceid", "");
    props.onSetlogin("logout");
  }

  function adminpage(props) {
    if (props.LoginRole === "user") {
      return "";
    } else {
      return (
        <Link to="/admin" className="linkmenu">
          <div className="content">
            <img src="./image/s_set.png" className="con_img" alt="관리자 이미지" /> 관리자:
            {props.LoginRole}
          </div>
        </Link>
      );
    }
  }



  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <Menu />
            </IconButton>

            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              MUI
            </Typography>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              {navItems.map((item) => (
                <Button
                  component={RouterLink}
                  key={item}
                  sx={{ color: '#fff' }}
                  to={item}
                >
                  {item}
                </Button>
              ))}
              <IconButton
              onClick={handleClickChangeLanguage}>
                <Language sx={{ fontSize: 40, color: colors.red[500] }} />
              </IconButton>
            </Box>
            <button className="" onClick={logoutbuttonHandler}> {t('SignOut')}</button>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ mx: 'auto', p: 6 }}>
          <Toolbar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Home" element={<HomePage />} />
            <Route path="/Control" element={<ControlPage {...props} />} />
            <Route path="/Data" element={<DataPage />} />
            <Route path="/Setting" element={<SettingPage {...props} />} />

            <Route path="/devices" element={<Devicepage />} />
            <Route path="/sensor" element={<Sensorpage />} />
            <Route path="/autocontrol" element={<Autocontrolpage {...props} />} />
            <Route path="/about" element={<About />} />
            <Route path="/setup" element={<About />} />
            <Route exact path="/admin" element={<AdminSetup />} />
          </Routes>
        </Box>
      </BrowserRouter>

    </Box>
  );
};

