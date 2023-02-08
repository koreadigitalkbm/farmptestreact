import React, { useState, useEffect } from "react";
import { BrowserRouter, Link as RouterLink, Routes, Route, useNavigate } from "react-router-dom";
import { AppBar, Box, Button, colors, CssBaseline, Divider, Drawer, IconButton, Link, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";

import { Menu, Language } from "@mui/icons-material";

import About from "./about";
import HomePage from "./HomePage";
import ControlPage from "./pages/controlPage";
import DataPage from "./pages/dataPage";
import SettingPage from "./pages/settingPage";


import SetupPage from "./setuppage";
import FactorySetup from "./factorysetup";

import Devicepage from "./devicepage";
import Autocontrolpage from "./control/autocontrolpage";
import myAppGlobal from "../myAppGlobal";

import { useTranslation } from "react-i18next";


const navMenu = ["Home", "Sensor", "Control", "Autocontrol", "Data", "Setting", "Setup"];

export default function FMainpage(props) {
  const { t} = useTranslation();
  const [fmaininit, setfmaininit] = useState(false);
  console.log("-------------------------FMainpage --------------------- loginrol:" + props.loginrol);
  console.log("fmaininit: "+ fmaininit);

  

  useEffect(() => {
    
    console.log("FMainpage -------- useEffect:");

    if (myAppGlobal.systeminformations == null) {
      myAppGlobal.farmapi.getSysteminformations().then((ret) => {
        myAppGlobal.systeminformations = ret.retParam;
        console.log("----------------------------systeminformations : " + myAppGlobal.systeminformations);
        setfmaininit(true);

      });
    }
  }, []);



  function logoutbuttonHandler(e) {
    props.mhandler(null, null);
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar component="nav">
        <Toolbar>
         
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}>
            MUI
          </Typography>

          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navMenu.map((item) => (
              <Button component={RouterLink} key={item} sx={{ color: "#fff" }} to={item}>
                {t(item)}
              </Button>
            ))}
           
          </Box>
          <button className="" onClick={logoutbuttonHandler}>
            {" "}
            {t("SignOut")}
          </button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ mx: "auto", p: 6 }}>
        <Toolbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Control" element={<ControlPage />} />
          <Route path="/Data" element={<DataPage />} />
          <Route path="/Setting" element={<SettingPage />} />

          <Route path="/devices" element={<Devicepage />} />
          
          <Route path="/autocontrol" element={<Autocontrolpage fmaininit={fmaininit} />} />
          <Route path="/setup" element={props.loginrol== "factoryadmin" ? <FactorySetup  {...props} />:<SetupPage {...props}/>} />
        </Routes>
      </Box>
    </Box>
  );
}
