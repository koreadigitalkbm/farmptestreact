import React, { useState, useEffect } from "react";
import { Link as RouterLink, Routes, Route } from "react-router-dom";
import { AppBar, Box, Button, CssBaseline, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { Dataset, Home, Logout, Menu as MenuIcon, QuestionMark, Settings, Speed,LocalFlorist } from "@mui/icons-material";



import HomePage from "./HomePage";
import ControlPage from "./pages/controlPage";
import DataPage from "./pages/dataPage";
import SettingPage from "./pages/settingPage";

import SetupPage from "./setuppage";
import FactorySetup from "./factorysetup";
import HDashboard from "./home/hdashboard";

import Autocontrolpage from "./control/autocontrolpage";
import myAppGlobal from "../myAppGlobal";

import { useTranslation } from "react-i18next";


const navMenu = ["Home", "Autocontrol", "Data"];
const dropMenu = ["Setting", "Sensor", "Control", "Setup"]

export default function FMainpage(props) {
    const { t } = useTranslation();
    const [navItems, setNavItems] = useState({});
    const [dropItems, setDropItems] = useState({});
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    console.log("-------------------------FMainpage --------------------- loginrol:" + props.loginrol);

    let isFarmLang = getCookieLang();

    if (isFarmLang) {
        console.log('현재 언어는 ' + isFarmLang + '입니다.')
    } else {
        let date = new Date();
        date.setDate(date.getDate() + 30);
        if (navigator.language === "ko-kr") {
            console.log('시스템 언어를 한국어로 설정합니다.')
            document.cookie = `lang=ko-KR; expires=${date.toUTCString()}`;
        } else {
            console.log('Set the system language to English.')
            document.cookie = `lang=en-US; expires=${date.toUTCString()}`;
        }
    }
    function getCookieLang() {
        return document.cookie.match('(^|;)\\s*lang\\s*=\\s*([^;]+)')?.pop() || undefined
    }

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
            case 'Home': return <Home />
            case 'Data': return <Dataset />
            case 'Autocontrol': return <LocalFlorist />
            case 'Setting': return <Settings />
            case 'Logout': return <Logout />

            default: return <QuestionMark />
        }
    }

    useEffect(() => {

        let navItems = {};
        let dropItems = {};
        navMenu.map((e) => (navItems[e] = t(e)));
        dropMenu.map((e) => (dropItems[e] = t(e)));
        setDropItems(dropItems);
        setNavItems(navItems);

        console.log("-------------------------FMainpage --------------------- useEffect:");

        if (myAppGlobal.systeminformations == null) {
            myAppGlobal.farmapi.getSysteminformations().then((ret) => {
                myAppGlobal.systeminformations = ret.retParam;
                console.log("----------------------------systeminformations : " + myAppGlobal.systeminformations);

                props.onSetSysteminfo("set info");
            });
        }
    }, [t, props]);

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
                                <Navicon id={item} />
                                &nbsp;{navItems[item]}
                            </Button>
                        ))}
                        <Button
                            id="nav-dropmenu-button"
                            aria-controls={open ? 'nav-dropmenu-list' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            variant="contained"
                            disableElevation
                            onClick={handleNavmenu}
                            endIcon={<MenuIcon />}
                        />
                        <Menu
                            elevation={0}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            id="nav-dropmenu-list"
                            MenuListProps={{
                                'aria-labelledby': 'nav-dropmenu-button',
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
                                &nbsp;{t("SignOut")}
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ mx: "auto", p: 6 }}>
                <Toolbar />

                <Routes>
                    <Route path="/" element={<HDashboard />} />
                    <Route path="/Home" element={<HDashboard />} />
                    <Route path="/Control" element={<ControlPage />} />
                    <Route path="/Data" element={<DataPage />} />
                    <Route path="/Setting" element={<SettingPage />} />

                    
                    <Route path="/sensor" element={<HDashboard />} />
                    <Route path="/autocontrol" element={<Autocontrolpage />} />
                    <Route path="/setup" element={props.loginrol === "factoryadmin" ? <FactorySetup  {...props} /> : <SetupPage {...props} />} />
                </Routes>
            </Box>
        </Box>
    );
}
