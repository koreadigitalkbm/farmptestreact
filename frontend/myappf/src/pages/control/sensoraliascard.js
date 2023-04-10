import React, { useState, useEffect } from "react";

import { Box, Button, Card, CardActions, TextField, IconButton, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import myAppGlobal from "../../myAppGlobal";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import KDUtil from "../../commonjs/kdutil";
import Sensordevice from "../../commonjs/sensordevice";

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
}));

const SensorAliasCard = (props) => {
  const [expanded, sethadlerexpended] = React.useState(false);
  const savealias = props.savehandler;
  let galiaslist = myAppGlobal.systeminformations.Alias;

  function saveconfig(muid, mname) {
    //    console.log("---------------------------- savealias: muid : " + muid + " name = " + mname);
    KDUtil.setAlias(muid, mname, myAppGlobal);
    savealias(galiaslist);
  }

  const handleExpandClick = () => {
    sethadlerexpended(!expanded);
  };

  const AliasSetting = (props) => {
    const [sindex, setSensor] = React.useState(0);
    const [sensoralisas, setAlias] = React.useState("");
    const [savedisable, setBtnDisable] = React.useState(true);

    let itemlist = [];

    console.log("---------------------------- AliasSetting sindex: " + sindex);
    function changeitem(mindex) {
      let aname = myAppGlobal.langT("LT_GROWPLANTS_ALIAS_NONE");
      if (itemlist.length == 0) {
        return;
      }
      if (itemlist[mindex].Alias != null) {
        aname = itemlist[mindex].Alias;
      }
      setSensor(mindex);
      setAlias(aname);
      setBtnDisable(true);
    }
    function changealias(mnewname) {
      setBtnDisable(false);
      setAlias(mnewname);
    }

    const handleChange = (event) => {
      switch (event.target.id) {
        case "sensoraliasText":
          changealias(event.target.value);

          break;
        default:
          changeitem(event.target.value);
          break;
      }
    };

    useEffect(() => {
      console.log("----------------------------AliasSetting  useEffect : ");

      changeitem(0);
    }, []);

    for (let i = 0; i < myAppGlobal.gsensorlist.length; i++) {
      let msensor = new Sensordevice(myAppGlobal.gsensorlist[i], myAppGlobal);
      let ms = {
        Name: "",
        Uid: msensor.UniqID,
        Alias: null,
      };
      ms.Name = msensor.OName + "(" + msensor.nodeID + "-" + msensor.channel + ")";
      ms.Alias = KDUtil.getAlias(msensor.UniqID, myAppGlobal);
      itemlist.push(ms);
    }

    let selectlist = itemlist.map((mitem, index) => <MenuItem value={index}>{mitem.Name}</MenuItem>);

    return (
      <Stack spacing={1} direction={{ xs: "column", sm: "row" }}>
        <FormControl sx={{ m: 1, maxWidth: 220 }}>
          <InputLabel id="demo-simple-select-helper-label">Sensor</InputLabel>
          <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" value={sindex} label="Sensor" onChange={handleChange}>
            {selectlist}
          </Select>
          <FormHelperText>{myAppGlobal.langT("LT_GROWPLANTS_ALIAS_HELPER")}</FormHelperText>
        </FormControl>

        <Box sx={{ m: 1, maxWidth: 240 }}>
          <TextField id="sensoraliasText" value={sensoralisas} helperText={myAppGlobal.langT("LT_GROWPLANTS_SENSOR_HELPER")} variant="filled" sx={{ m: 1, minWidth: 120 }} onChange={handleChange} />
        </Box>

        <Stack direction="column" alignItems="flex-start" spacing={1}>
          <Button variant="contained" disabled={savedisable} sx={{ mt: 1, minHeight: 50, minWidth: 140, backgroundColor: "#fb8c00" }} onClick={() => saveconfig(itemlist[sindex].Uid, sensoralisas)} endIcon={<SaveAltIcon fontSize="large" />}>
            {myAppGlobal.langT("LT_GROWPLANTS_SAVE")}
          </Button>
          <FormHelperText>{myAppGlobal.langT("LT_GROWPLANTS_SAVE_NOTI")}</FormHelperText>
        </Stack>
      </Stack>
    );
  };

  return (
    <CardFarmsCube>
      <CardActions disableSpacing>
        <Typography variant="h6">{myAppGlobal.langT("LT_GROWPLANTS_SENSORALIAS_TITLE")}</Typography>

        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
          <Typography>{myAppGlobal.langT("LT_GROWPLANTS_SETTING")}</Typography>
          {expanded === false ? <ExpandMoreIcon color="success" fontSize="large" /> : <ExpandLessIcon color="success" fontSize="large" />}
        </ExpandMore>
      </CardActions>
      {expanded === true ? <hr /> : null}
      <Box sx={{ m: 1, bgcolor: "#c5e1a5" }}>{expanded === true ? <AliasSetting /> : ""}</Box>
    </CardFarmsCube>
  );
};
export default SensorAliasCard;
