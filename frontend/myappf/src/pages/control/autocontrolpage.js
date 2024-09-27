import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";
import Autocontroleditbox from "./autocontroleditbox";
import AutoControlconfig from "../../commonjs/autocontrolconfig";
import { Box, Button, Card, FormHelperText, CardHeader,FormGroup , Grid, IconButton, Stack, Switch, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddCardIcon from "@mui/icons-material/AddCard";
import AlertDialog from "../uicomponent/basicalert";
import SensorAliasCard from "./sensoraliascard";
import ActuatorAliasCard from "./devicealiascard";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import AutoModeIcon from '@mui/icons-material/AutoMode';


const CardFarmsCube = styled(Card)(({ theme }) => ({
  margin: "4px",
  maxWidth: "50rem",
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

const Autocontrolpage = (props) => {
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
  const [issaving, setissaving] = useState(false);


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
    //console.log(bexpends);
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

    //console.log("Autocontrolcard  expanded: " + expanded);

    const saveconfig = (mconfig, newstate) => {

      setissaving(true);
      myAppGlobal.farmapi.saveAutocontrolconfig(mconfig).then((ret) => {

        setissaving(false);
        if (ret == null) {

            alertparams.type = "error";
            alertparams.title = myAppGlobal.langT("LT_ALERT_FAIL");
            alertparams.message = myAppGlobal.langT("LT_GROWPLANTS_AUTOCONTROLSETTING_FAIL");
            setAlert(alertparams);

        } else {
          console.log("Autocontrolcard  retMessage: " + ret.retMessage);

          AutoControlconfig.CopyObj(mydata, mconfig);

          if (newstate == null) {
            
            
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
      let copycfg = AutoControlconfig.deepcopy(mydata);
      copycfg.Enb = newstate;
      saveconfig(copycfg, newstate);

      setautoenable(newstate);
    };

    return (
      <CardFarmsCube>
        <Stack spacing={2} direction={{ xs: "column", sm: "row" }} justifyContent="space-between">
        
          <Box align="left" sx={{ minWidth: 360  }}>
            <Typography variant="h6" sx={{ m: 2 }}>
              {mydata.Name}
            </Typography>
          </Box>

          <Box align="right">
                    {issaving == true? <CircularProgress color="secondary" />:<FormGroup> <FormControlLabel control={<Switch  checked={autoenable} disabled={expanded} onChange={handleChange} name="autoenable" />} label={myAppGlobal.langT("LT_GROWPLANTS_AUTOCONTROLUSING")} /> <FormHelperText> {autoenable === true ? myAppGlobal.langT("LT_AUTOCONTROL_RUN_AUTO") : myAppGlobal.langT("LT_AUTOCONTROL_RUN_MANUAL")}</FormHelperText></FormGroup>}
          </Box>

          <Box align="right"  >
            <ExpandMore  expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
              <Typography  sx={{color: "#257115" }} >{autoenable === true ? myAppGlobal.langT("LT_GROWPLANTS_AUTO") : myAppGlobal.langT("LT_GROWPLANTS_MANUAL")} </Typography>
              {expanded === false ? <ExpandMoreIcon color="success" fontSize="large" /> : <ExpandLessIcon color="success" fontSize="large" />}
            </ExpandMore>
           
          </Box>
        </Stack>

        <Box sx={{ m: 0 }}>{expanded === true ? <Autocontroleditbox key={"autobox" + mydata.Name} myconfig={mydata} savecfg={saveconfig} /> : ""}</Box>
      </CardFarmsCube>
    );
  };
  
  return (
    <Box sx={{ maxWidth: "50rem" }}>
      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <Card sx={{ backgroundColor: "#f1f8e9" }}>
            <CardHeader  avatar={<FormatListBulletedIcon  sx={{ color: "#59a819" }}/>} titleTypographyProps={{ variant: "h7" ,color: "#197809" }} title={myAppGlobal.langT("LT_AUTOCONTROL_LIST")} />
            <Stack direction="column">
              {mAutolist.map((mconfig, index) => (
                <Autocontrolcard key={"autobox" + index} myconfig={mconfig} hexp={expandedcfg} mindex={index} bexp={bexpendeds} />
              ))}
            </Stack>
            <Stack direction="column" alignItems="flex-end">
              <Button size="large" endIcon={<AddCardIcon />}>
                {myAppGlobal.langT("LT_GROWPLANTS_ADDAUTOCONTROL")}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={12} md={12}>
        <Card sx={{ backgroundColor: "#e1f8d9" }}>
          <CardHeader  avatar={<LowPriorityIcon  sx={{ color: "#59a819" }}/>}  titleTypographyProps={{ variant: "h7" }} title={myAppGlobal.langT("LT_GROWPLANTS_ETC_TITLE")} />
          <Stack direction="column">
            <SensorAliasCard savehandler={savealias} />
            <ActuatorAliasCard savehandler={savealias} />
          </Stack>
        </Card>
      </Grid>

      <AlertDialog params={alertmssage} />
    </Box>
  );
};

export default Autocontrolpage;
