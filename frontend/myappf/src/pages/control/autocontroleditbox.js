import React from "react";


import { Box, Button, Card, CardHeader, Divider, Modal, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "../muiTheme";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import { useTranslation } from "react-i18next";

import KDUtil from "../../commonjs/kdutil";
import KDDefine from "../../commonjs/kddefine";

import JukeboxTemperatureM1 from "./jukeboxtemperature";
import JukeboxWatersupplyM1 from "./jukeboxwatersupply";

const theme = muiTheme;
const commonStyles = {
  bgcolor: "background.paper",
  borderColor: "info.main",
  m: 1,
  border: 1,
  width: "50rem",
  height: "5rem",
};



export default function Autocontroleditbox(props) {
  const { t  } = useTranslation();
    const myeditcfg = props.myconfig;

  

  if (myeditcfg == null) {
    return null;
  } 

  console.log("Autocontroleditbox  name : " + myeditcfg.Name );

    let copycfg = myeditcfg;

    function inputallchangeHandler(e) {
      console.log("inputallchangeHandler name: " + e.target.name + " type : " + e.target.type);
      switch (e.target.type) {
        case "time":
          copycfg[e.target.name] = KDUtil.timeTosec(e.target.value);
          break;
        default:
          copycfg[e.target.name] = e.target.value;
          break;
      }
    }



    
    
    const formAutoContent = () => {
      console.log("formAutoContent Cat: " + copycfg.Cat);
      switch (copycfg.Cat) {
        case KDDefine.AUTOCategory.ACT_HEAT_COOL_FOR_FJBOX:
          return (<JukeboxTemperatureM1 keyname="tempcontrol" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} /> );
        case KDDefine.AUTOCategory.ATC_WATER:
          return (<JukeboxWatersupplyM1 keyname="watersuply" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} /> );
        default:
          return (<JukeboxTemperatureM1 keyname="tempcontrol" initvalue={copycfg} inputallchangeHandler={inputallchangeHandler} /> );
      }
    };

    return (
      <div>
        
      
      <div className="auto_control">

        <div className="autosetupinnerbox">
          {formAutoContent()}
        </div>
      </div>
      </div>
    );
  
}
