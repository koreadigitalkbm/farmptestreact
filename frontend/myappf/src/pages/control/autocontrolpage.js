import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";
import Autocontroleditbox from "./autocontroleditbox";

import { Box, Button, Card, CardHeader, Divider, Modal, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Switch from "@mui/material/Switch";
import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "../muiTheme";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import FormControlLabel from "@mui/material/FormControlLabel";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import AddCardIcon from "@mui/icons-material/AddCard";

import { useTranslation } from "react-i18next";

const CardFarmsCube = styled(Card)(({ theme }) => ({
  margin: "6px",
  width: "50rem",
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
        alert("자동제어설정이 저장되었습니다.");
        //다음페이지이동시에 자동제어 설정을 다시 읽어올수 있도록 전역변수 초기화
        myAppGlobal.Autocontrolcfg = null;
      } else {
        if (newstate === true) {
          alert("자동제어가 시작되었습니다. 수동으로 제어할 수 없습니다. ");
        } else {
          alert("자동제어가 중지되었습니다. 수동으로 제어할 수 있습니다. ");
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
      <ThemeProvider theme={muiTheme}>
        <CardActions disableSpacing>
          <Typography variant="h6" sx={{ width: 400 }}>
            {mydata.Name}
          </Typography>
          <FormControlLabel control={<Switch checked={autoenable} disabled={expanded} onChange={handleChange} name="autoenable" />} label="자동제어사용" />

          <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
            <Typography>{autoenable === true ? "설정변경" : "수동제어"} </Typography>
            {expanded === false ? <ExpandMoreIcon color="success" fontSize="large" /> : <ExpandLessIcon color="success" fontSize="large" />}
          </ExpandMore>
        </CardActions>
      </ThemeProvider>

      <div>{expanded === true ? <Autocontroleditbox key={"autobox" + mydata.Name} myconfig={mydata} /> : ""}</div>

      {expanded === true && mydata.Enb === true ? (
        <div>
          
          <Button variant="contained" sx={{ backgroundColor: "#fb8c00" }} onClick={() => saveconfig(mydata, null)} endIcon={<SaveAltIcon fontSize="large" />}>
            저장
          </Button>
        </div>
      ) : null}
    </CardFarmsCube>
  );
};

const Autocontrolpage = (props) => {
  const { t } = useTranslation();
  const [mAutolist, setUpdateauto] = useState(myAppGlobal.Autocontrolcfg);

  console.log("----------------------------Autocontrolpage ");

  useEffect(() => {
    console.log("Autocontrolpage useEffect  length: " + mAutolist.length + " myAppGlobal.systeminformations : " + myAppGlobal.systeminformations);

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

  function onAdd() {}

  const autoList = mAutolist.map((localState, index) => <Autocontrolcard key={"autobox" + index} myconfig={localState} />);

  return (
    <div>
      <ThemeProvider theme={muiTheme}>
        <Card sx={{ minWidth: 300, m: 3, backgroundColor: "#fff3e0" }}>
          <CardHeader title={"자동 제어 목록입니다."} />
          <Stack direction="column">{autoList}</Stack>

          <Button endIcon={<AddCardIcon fontSize="large" />}>자동제어 추가</Button>
        </Card>
      </ThemeProvider>
    </div>
  );
};

export default Autocontrolpage;
