import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";
import Autocontroleditbox from "./autocontroleditbox";

import { Box, Button, Card, CardActions, CardHeader, Grid, IconButton, Stack, Switch, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "../muiTheme";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddCardIcon from "@mui/icons-material/AddCard";
import AlertDialog from "../uicomponent/basicalert";



const CardFarmsCube = styled(Card)(({ theme }) => ({
  margin: "4px",
  minWidth: "45rem",
  backgroundColor: "#dcedc8",
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

const Autocontrolcard = (props) => {
  const mydata = props.myconfig;
  const hadlerexpended = props.hexp;
  const myindex = props.mindex;
  const [autoenable, setautoenable] = React.useState(mydata.Enb);
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

  const [alertmssage, setAlert] = useState(alertparams);
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

      <AlertDialog params={alertmssage} />
    </CardFarmsCube>
  );
};

const Autocontrolpage = (props) => {
  let bexpends = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];

  const [mAutolist, setUpdateauto] = useState(myAppGlobal.Autocontrolcfg);
  const [bexpendeds, setbexpendeds] = useState([]);

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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Card sx={{ backgroundColor: "#f1f8e9" }}>
            <CardHeader titleTypographyProps={{ variant: "h7" }} title={myAppGlobal.langT("LT_GROWPLANTS_TITLE")} />
            <Stack direction="column">
              {mAutolist.map((mconfig, index) => (
                <Autocontrolcard key={"autobox" + index} myconfig={mconfig} hexp={expandedcfg} mindex={index} bexp={bexpendeds} />
              ))}
            </Stack>
            <Stack direction="column" alignItems="flex-end">
              <Button size="large" endIcon={<AddCardIcon fontSize="large" />}>
                {myAppGlobal.langT("LT_GROWPLANTS_ADDAUTOCONTROL")}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Autocontrolpage;
