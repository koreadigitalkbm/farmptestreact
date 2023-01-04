
import React, { useState, useEffect } from "react";
import { BrowserRouter, Link as RouterLink, Routes, Route } from "react-router-dom";
import Link from "@mui/material/Link";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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

const drawerWidth = 240;
const navItems = ['Home', 'Sensor', 'Control', 'autocontrol', 'Data', 'Setting', 'setup', ];

export default function FarmMainpage(props) {
  console.log("-------------------------FarmMainpage ---------------------LoginRole : " + props.LoginRole + " , window: "+window);
  const [mobileOpen, setMobileOpen] = useState(false);


  


  const handleDrawerToggle = () => {
   // setMobileOpen((prevState) => !prevState);

  };


    




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

  function logoutbuttonHandler( e) {
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
            <img src="./image/s_set.png" className="con_img" alt="관리자 이미지"/> 관리자:
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
                <MenuIcon />
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
              </Box>
              <button className="" onClick={logoutbuttonHandler}> 로그아웃</button>
              
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

