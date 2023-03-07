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
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import AddCardIcon from "@mui/icons-material/AddCard";



const CardFarmsCube = styled(Card)(({ theme }) => ({
  margin: "4px",
  minWidth: "45rem",
  backgroundColor: theme.palette.mode === "dark" ? "#ffe0b2" : "#ffe0b2",
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
  const [expanded, setExpanded] = React.useState(false);
  const [autoenable, setautoenable] = React.useState(mydata.Enb);

  const saveconfig = (mconfig, newstate) => {
    myAppGlobal.farmapi.saveAutocontrolconfig(mconfig).then((ret) => {
      console.log("Autocontrolcard  retMessage: " + ret.retMessage);

      if (newstate == null) {
        alert(myAppGlobal.langT("LT_GROWPLANTS_AUTOCONTROLSETTINGCONFIRMED"));
        //다음페이지이동시에 자동제어 설정을 다시 읽어올수 있도록 전역변수 초기화
        //myAppGlobal.Autocontrolcfg = null;
      } else {
        if (newstate === true) {
          alert(myAppGlobal.langT("LT_GROWPLANTS_AUTOCONTROLSTART"));
        } else {
          alert(myAppGlobal.langT("LT_GROWPLANTS_AUTOCONTROLSTOP"));
        }
      }
    });
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
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
      

      <div>{expanded === true ? <Autocontroleditbox key={"autobox" + mydata.Name} myconfig={mydata} /> : ""}</div>

      {expanded === true && mydata.Enb === true ? (
        <div>
          
          <Button variant="contained" sx={{ backgroundColor: "#fb8c00" }} onClick={() => saveconfig(mydata, null)} endIcon={<SaveAltIcon fontSize="large" />}>
            {myAppGlobal.langT('LT_GROWPLANTS_SAVE')}
          </Button>
        </div>
      ) : null}
    </CardFarmsCube>
  );
};

const Autocontrolpage = (props) => {
  
  const [mAutolist, setUpdateauto] = useState(myAppGlobal.Autocontrolcfg);

  console.log("----------------------------Autocontrolpage ");

  useEffect(() => {

    console.log("----------------------------Autocontrolpage  useEffect : "+ myAppGlobal.Autocontrolcfg);

    //console.log("Autocontrolpage useEffect  length: " + mAutolist.length + " myAppGlobal.systeminformations : " + myAppGlobal.systeminformations);

    /*
    if (myAppGlobal.systeminformations != null) {
    myAppGlobal.farmapi.getAutocontrolconfig().then((ret) => {
          myAppGlobal.Autocontrolcfg = ret.retParam;
          myAppGlobal.Autocontrolcfg.map(function (item) {
            if (item.Lid != null) {
              item.Name = t(item.Lid);
            }
          });
          console.log("----------------------------systeminformations Autocontrolcfg: " + myAppGlobal.Autocontrolcfg);
          setUpdateauto(myAppGlobal.Autocontrolcfg);
        });
    }
    */
  }, []);

  

  let autoList =null;
  if(mAutolist !=null)
  {
    autoList = mAutolist.map((localState, index) => <Autocontrolcard key={"autobox" + index} myconfig={localState} />);
  }
  

  return (
    <Box sx={{ flexGrow: 1 }}>
    <Grid container spacing={1}>
      
      <Grid item xs={12} md={12}>
      
        <Card sx={{  backgroundColor: "#fff3e0" }}>
          <CardHeader  titleTypographyProps={{variant:'h7' }} title={myAppGlobal.langT('LT_GROWPLANTS_TITLE')} />
          <Stack direction="column">{autoList}</Stack>
          <Button endIcon={<AddCardIcon fontSize="large" />}>{myAppGlobal.langT('LT_GROWPLANTS_ADDAUTOCONTROL')}</Button>
        </Card>
      
      
      </Grid>
      </Grid>
      </Box>
  );
};

export default Autocontrolpage;
