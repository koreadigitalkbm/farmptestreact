import * as React from 'react';
import { BrowserRouter, Link as RouterLink, Routes, Route } from "react-router-dom";
import Link from "@mui/material/Link";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles'
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

import muiTheme from './muiTheme';

import About from "./about";
import HomePage from "./HomePage";
import ControlPage from "./pages/controlPage";
import DataPage from "./pages/dataPage";
import SettingPage from "./pages/settingPage";

import AdminSetup from "./adminsetup";
import Sensorpage from "./sensorpage";
import Devicepage from "./devicepage";
import Autocontrolpage from "./autocontrolpage";

import myAppGlobal from "../myAppGlobal";

const drawerWidth = 240;
const navItems = ['Home', 'Sensor', 'Control', 'Data', 'Setting'];

export default function Mainpage(props) {
  console.log("-------------------------main page ---------------------LoginRole : " + props.LoginRole);

  const { window } = props; 
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const theme = muiTheme

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
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
            <ListItemButton
              sx={{ textAlign: 'center' }}
              to={item}
            >
              <ListItemText primary={appbarAlias(item)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

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

  function appbarAlias(name) {
    let aliasName;

    switch (name) {
      case 'Home':
        aliasName = '홈'
        break;

      case 'Control':
        aliasName = '제어'
        break;

      case 'Data':
        aliasName = '데이터'
        break;

      case 'Setting':
        aliasName = '설정'
        break;

      case 'Sensor':
        aliasName = '센서'
        break;

      default:
        aliasName = '미정'
        break;
    }

    return aliasName;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <ThemeProvider theme={theme}>
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
                    {appbarAlias(item)}
                  </Button>
                ))}
              </Box>
            </Toolbar>
          </AppBar>
          <Box component="nav">
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: 'block', sm: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
              }}
            >
              {drawer}
            </Drawer>
          </Box>
          <Box component="main" sx={{ p: 3 }}>
            <Toolbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Home" element={<HomePage />} />
              <Route path="/Control" element={<ControlPage />} />
              <Route path="/Data" element={<Devicepage />} />
              <Route path="/Setting" element={<SettingPage />} />
              <Route path="/Sensor" element={<Sensorpage />} />


              <Route path="/devices" element={<Devicepage />} />
              <Route path="/sensor" element={<Sensorpage />} />
              <Route path="/autocontrol" element={<Autocontrolpage />} />
              <Route path="/about" element={<About />} />
              <Route path="/setup" element={<About />} />
              <Route exact path="/admin" element={<AdminSetup />} />
            </Routes>
          </Box>
        </BrowserRouter>
      </ThemeProvider>
    </Box>
  );
};

