import * as React from 'react';
import { BrowserRouter, Link as RouterLink, Routes, Route } from "react-router-dom";

import {AppBar, Box, Button, CssBaseline, Divider, Drawer, IconButton, Link, List, ListItem, ListItemButton, ListItemText, MenuIcon, Toolbar, Typography} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles'

import muiTheme from './muiTheme';

import About from "./about";
import HomePage from "./HomePage";
import ControlPage from "./pages/controlPage";
import DataPage from "./pages/dataPage";
import SettingPage from "./pages/settingPage";

import AdminSetup from "./adminsetup";
import Sensorpage from "./sensorpage";
import Devicepage from "./devicepage";

import myAppGlobal from "../myAppGlobal";

import { useTranslation } from "react-i18next";

const drawerWidth = 240;

export default function Mainpage(props) {
  console.log("-------------------------main page ---------------------LoginRole : " + props.LoginRole);

  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const {t, i18n } = useTranslation();

  const navItems = [t('Home'), t('Sensor'), t('Control'), t('Data'), t('Setting'), t('setup')];

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
            <img src="./image/s_set.png" className="con_img" alt="????????? ?????????" /> ?????????:
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
        aliasName = '???'
        break;

      case 'Control':
        aliasName = '??????'
        break;

      case 'Data':
        aliasName = '?????????'
        break;

      case 'Setting':
        aliasName = '??????'
        break;

      case 'Sensor':
        aliasName = '??????'
        break;

      case 'setup':
        aliasName = '????????????'
        break;

      default:
        aliasName = '??????'
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

