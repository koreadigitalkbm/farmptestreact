import React, { useState, useEffect } from "react";
import myAppGlobal from "../../myAppGlobal";
import Autocontroleditbox from "./autocontroleditbox";

import { Box, Button, Card, CardHeader, Divider, Modal, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Switch from "@mui/material/Switch";
import { ThemeProvider } from "@mui/material/styles";
import muiTheme from "../muiTheme";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import FormControlLabel from "@mui/material/FormControlLabel";

const commonStyles = {
  bgcolor: "background.paper",
  borderColor: "info.main",
  m: 1,
  border: 1,
  width: "50rem",
  height: "5rem",
};

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
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
    <div>
      <Box sx={{ ...commonStyles, borderRadius: "16px" }}>
        <ThemeProvider theme={muiTheme}>
          <CardActions disableSpacing>
            <LabelImportantIcon color="action" fontSize="large" />
            <Typography variant="h5">{mydata.Name}</Typography>
            <FormControlLabel control={<Switch checked={autoenable} disabled={expanded} onChange={handleChange} name="autoenable" />} label="자동제어사용" />
            <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
              <ExpandMoreIcon color="success" fontSize="large" />
            </ExpandMore>
            <Typography variant="h6">{autoenable === true ? "설정변경" : "수동제어"} </Typography>
          </CardActions>
        </ThemeProvider>
      </Box>

      <div>{expanded === true ? <Autocontroleditbox key={"autobox" + mydata.Name} myconfig={mydata} /> : ""}</div>

      <div className="control_end">
        {expanded === true && mydata.Enb === true ? (
          <button className="cont_save" onClick={() => saveconfig(mydata, null)} id="editcheck">
            저장{" "}
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const Autocontrolpage = (props) => {
  const [mAutolist, setUpdateauto] = useState([]);

  console.log("----------------------------Autocontrolpage fmaininit: " + props.fmaininit);
  useEffect(() => {
    console.log("Autocontrolpage useEffect  length: " + mAutolist.length + " myAppGlobal.systeminformations : " + myAppGlobal.systeminformations);

    if (myAppGlobal.systeminformations != null) {
      if (myAppGlobal.Autocontrolcfg != null) {
        setUpdateauto(myAppGlobal.Autocontrolcfg);
      } else {
        myAppGlobal.farmapi.getAutocontrolconfig().then((ret) => {
          myAppGlobal.Autocontrolcfg = ret.retParam;
          console.log("----------------------------systeminformations Autocontrolcfg: " + myAppGlobal.Autocontrolcfg);
          console.log(myAppGlobal.Autocontrolcfg);
          setUpdateauto(myAppGlobal.Autocontrolcfg);
        });
      }
    }
  }, [props.fmaininit, mAutolist]);

  function onAdd() {}

  const autoList = mAutolist.map((localState, index) => <Autocontrolcard key={"autobox" + index} myconfig={localState} />);

  return (
    <div>
      <div className="autocontroltable">{autoList} </div>
      <div className="auto">
        <div className="select_add">
          <button className="add_button" onClick={() => onAdd()}>
            + 자동제어 추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default Autocontrolpage;
