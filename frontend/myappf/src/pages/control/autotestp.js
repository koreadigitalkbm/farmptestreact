import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";
import Autocontroleditbox from "./autocontroleditbox";

import { Box, Button, Card, CardActions, CardHeader, Grid, IconButton, Stack, Switch, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ThemeProvider } from "@mui/material/styles";
import Paper from '@mui/material/Paper';
import muiTheme from "../muiTheme";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddCardIcon from "@mui/icons-material/AddCard";
import AlertDialog from "../uicomponent/basicalert";
import SensorAliasCard from "./sensoraliascard";
import ActuatorAliasCard from "./devicealiascard";

const CardFarmsCube = styled(Card)(({ theme }) => ({
  margin: "4px",
  minWidth: "45rem",
  backgroundColor: "#dcedc8",
}));

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const AutocontrolTestpage = (props) => {
  let bexpends = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

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

  const [mAutolist, setUpdateauto] = useState(myAppGlobal.Autocontrolcfg);
  const [bexpendeds, setbexpendeds] = useState([]);
  const [alertmssage, setAlert] = useState(alertparams);

  console.log("----------------------------Autocontrolpage ");

  useEffect(() => {
    console.log("----------------------------Autocontrolpage  useEffect : ");

    setbexpendeds(bexpends);
  }, []);

  function expandedcfg(mindex, mybexp) {
    console.log("----------------------------expandedcfg mindex: " + mindex + " mybexp : " + mybexp);
    for (let i = 0; i < bexpends.length; i++) {
      if (i == mindex) {
        bexpends[i] = mybexp;
      } else {
        bexpends[i] = false;
      }
    }
    console.log(bexpends);
    setbexpendeds(bexpends);
  }

  const savealias = (mconfig) => {
    myAppGlobal.farmapi.saveAliasconfig(mconfig).then((ret) => {
      console.log("saveAliasconfig  retMessage: " + ret.retMessage);
      alertparams.type = "success";
      alertparams.title = myAppGlobal.langT("LT_ALERT_SUCESS");
      alertparams.message = myAppGlobal.langT("LT_GROWPLANTS_ALIAS_CONFIRMED");
      setAlert(alertparams);
    });
  };

  const Autocontrolcard = (props) => {
    const mydata = props.myconfig;
    const hadlerexpended = props.hexp;
    const myindex = props.mindex;
    const [autoenable, setautoenable] = React.useState(mydata.Enb);

    let expanded = props.bexp[myindex];

    console.log("Autocontrolcard  expanded: " + expanded);

    const saveconfig = (mconfig, newstate) => {
      myAppGlobal.farmapi.saveAutocontrolconfig(mconfig).then((ret) => {
        console.log("Autocontrolcard  retMessage: " + ret.retMessage);

        if (newstate == null) {
          // alert(myAppGlobal.langT("LT_GROWPLANTS_AUTOCONTROLSETTINGCONFIRMED"));

          alertparams.type = "success";
          alertparams.title = myAppGlobal.langT("LT_ALERT_SUCESS");
          alertparams.message = myAppGlobal.langT("LT_GROWPLANTS_AUTOCONTROLSETTINGCONFIRMED");
          setAlert(alertparams);
        } else {
          if (newstate === true) {
            //alert(myAppGlobal.langT("LT_GROWPLANTS_AUTOCONTROLSTART"));

            alertparams.type = "success";
            alertparams.title = myAppGlobal.langT("LT_ALERT_SUCESS");
            alertparams.message = myAppGlobal.langT("LT_GROWPLANTS_AUTOCONTROLSTART");
            setAlert(alertparams);
          } else {
            //alert(myAppGlobal.langT("LT_GROWPLANTS_AUTOCONTROLSTOP"));
            alertparams.type = "success";
            alertparams.title = myAppGlobal.langT("LT_ALERT_SUCESS");
            alertparams.message = myAppGlobal.langT("LT_GROWPLANTS_AUTOCONTROLSTOP");
            setAlert(alertparams);
          }
        }
      });
    };

    const handleExpandClick = () => {
      let bex = !expanded;
      expanded = bex;
      hadlerexpended(myindex, bex);
    };

    const handleChange = (event) => {
      const newstate = !autoenable;
      mydata.Enb = newstate;

      saveconfig(mydata, newstate);
      setautoenable(newstate);
    };

    return (
      <CardFarmsCube>
        <CardActions disableSpacing>
          <Typography variant="h6" sx={{ minWidth: 300 }}>
            {mydata.Name}
          </Typography>
          <FormControlLabel control={<Switch checked={autoenable} disabled={expanded} onChange={handleChange} name="autoenable" />} label={myAppGlobal.langT("LT_GROWPLANTS_AUTOCONTROLUSING")} />

          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
            <Typography>{autoenable === true ? myAppGlobal.langT("LT_GROWPLANTS_AUTO") : myAppGlobal.langT("LT_GROWPLANTS_MANUAL")} </Typography>
            {expanded === false ? <ExpandMoreIcon color="success" fontSize="large" /> : <ExpandLessIcon color="success" fontSize="large" />}
          </ExpandMore>
        </CardActions>

        <Box sx={{ m: 0 }}>{expanded === true ? <Autocontroleditbox key={"autobox" + mydata.Name} myconfig={mydata} savecfg={saveconfig} /> : ""}</Box>
      </CardFarmsCube>
    );
  };

  return (
    <Box sx={{ width: 1 }}>
    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
      <Box gridColumn="span 8">
        <Item>xs=8</Item>
      </Box>
      <Box gridColumn="span 4">
        <Item>xs=4</Item>
      </Box>
      <Box gridColumn="span 4">
        <Item>xs=4</Item>
      </Box>
      <Box gridColumn="span 8">
        <Item>xs=8</Item>
      </Box>
    </Box>
  </Box>
  );
};

export default AutocontrolTestpage;
