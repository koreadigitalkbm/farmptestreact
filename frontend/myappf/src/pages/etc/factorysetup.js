import React, { useEffect } from "react";
import { Box, Button, Card, CardHeader, Divider, Modal, Stack, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";

import muiTheme from "../muiTheme";
import myAppGlobal from "../../myAppGlobal";

import KDDefine from "../../commonjs/kddefine";
import DeviceSystemconfig from "../../commonjs/devsystemconfig";

const theme = muiTheme;

export default function FactorySetup(props) {
  const { t } = useTranslation();
  const [pmodel, setpmodel] = React.useState(null);

  let newconfig = null;
  console.log("----------------------------FactorySetup");

  useEffect(() => {
    console.log("----------------------------FactorySetup useEffect ");
  }, []);

  if (myAppGlobal.systeminformations != null) {
    newconfig = DeviceSystemconfig.Clonbyjsonobj(myAppGlobal.systeminformations.Systemconfg);

    if (pmodel == null) {
      //   setpmodel(newconfig.productmodel);
    }
  }

  function inputonchangeHandler(event) {
    console.log("inputallchangeHandler name: " + event.target.name + " value : " + event.target.value);
    switch (event.target.name) {
      case "productmodel":
        newconfig[event.target.name] = event.target.value;
        //     setpmodel(event.target.value);
        break;
      default:
        newconfig[event.target.name] = event.target.value;
        break;
    }
  }

  

  function shellcmdtodevice() {
    
    myAppGlobal.farmapi.setshellcommand("del READ.md ","../frontend/myappf/").then((ret) => {
    
      console.log(" shellcmdtodevice ret : " + ret);
      console.log(ret);

    
    });
  }



    function readdevicelog(e) {
    
    myAppGlobal.farmapi.getdevicelog().then((ret) => {
      let devmlog = ret.retParam;
      console.log(" getdevicelg ret : " + ret);

      console.log(ret);

      //우선 콘솔에 출력하고 나중에 웹페이지에 구현하자
      devmlog.loglist.forEach((element) => {
        if (element != null) {
          console.log(element);
        }
      });
    });
  }

  function swupdate(mver) {
    console.log("resetConfig... ");

    myAppGlobal.farmapi.setsoftwareupdate(true,mver).then((ret) => {
      if (ret.IsOK == true) {
        alert("업데이트하였습니다.");
      } else {
        alert("실패하였습니다.");
      }
      console.log("setDeviceconfigsetup  uid: " + ret);
    });
  }


  function resetConfig() {
    console.log("resetConfig... ");

    myAppGlobal.farmapi.resetAutocontrolconfig().then((ret) => {
      if (ret.IsOK == true) {
        alert("초기화되었습니다. 장비를 재시작해야 적용됩니다.");
      } else {
        alert("실패하였습니다.");
      }
      console.log("setDeviceconfigsetup  uid: " + ret);
    });
  }

  function setupSave(mcfg) {
    console.log("setupSave deviceuniqid: " + mcfg.deviceuniqid + " productmodel : " + mcfg.productmodel);
    myAppGlobal.farmapi.setMyInfo(mcfg).then((ret) => {
      if (ret.IsOK == true) {
        alert("저장되었습니다. 장비를 재시작해야 적용됩니다.");
      } else {
        alert("실패하였습니다.");
      }
      console.log("setDeviceconfigsetup  uid: " + ret);
    });
  }

  function handleChange(event) {
    console.log("handleChange id: " + event.target.id + " type : " + event.target.value);
    newconfig.productmodel = event.target.value;
    setpmodel(event.target.value);

    console.log(event.target);
  }

  function cardInfo() {
    if (newconfig == null) {
      return <Box> nodata... </Box>;
    } else {
      return (
        <Box>
          <Typography id="modal-configure-title" variant="h6" component="h2">
            {" "}
            Product Name:{" "}
          </Typography>
          <TextField name="productname" defaultValue={newconfig.productname} type="text" variant="outlined" onChange={inputonchangeHandler} sx={{ "& .MuiOutlinedInput-input": { border: 0 } }} />
          <Typography id="modal-configure-title" variant="h6" component="h2">
            {" "}
            Device Unique ID:{" "}
          </Typography>
          <TextField name="deviceuniqid" defaultValue={newconfig.deviceuniqid} type="text" variant="outlined" onChange={inputonchangeHandler} sx={{ "& .MuiOutlinedInput-input": { border: 0 } }} />
          <Typography id="modal-configure-title" variant="h6" component="h2">
            Comport :{" "}
          </Typography>
          <TextField name="comport" defaultValue={newconfig.comport} type="text" variant="outlined" onChange={inputonchangeHandler} sx={{ "& .MuiOutlinedInput-input": { border: 0 } }} />

          <Typography id="modal-configure-title" variant="h6" component="h2">
            Password :{" "}
          </Typography>
          <TextField name="password" defaultValue={newconfig.password} type="text" variant="outlined" onChange={inputonchangeHandler} sx={{ "& .MuiOutlinedInput-input": { border: 0 } }} />

          <Typography id="modal-configure-title" variant="h6" component="h2">
            Prodcut Model :{" "}
          </Typography>

          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <NativeSelect
                defaultValue={newconfig.productmodel}
                inputProps={{
                  name: "productmodel",
                  id: "uncontrolled-native",
                }}
                onChange={inputonchangeHandler}
              >
                {KDDefine.PModelList.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </NativeSelect>
            </FormControl>
          </Box>
        </Box>
      );
    }
  }

  return (
    <Box>
      <ThemeProvider theme={theme}>
        <Typography variant="h5">Factory Setup...</Typography>
        {cardInfo()}

        <Stack spacing={2} justifyContent="center" sx={{ mt: 2, mb: 3 }}>
          <Button type="submit" variant="contained" onClick={() => setupSave(newconfig)} endIcon={<SendIcon />}>
            {" "}
            Save{" "}
          </Button>
        </Stack>

        <Stack spacing={2} justifyContent="center" sx={{ mt: 2, mb: 3 }}>
          <Button type="submit" variant="contained" onClick={() => resetConfig()} endIcon={<SendIcon />}>
            자동제어초기화
          </Button>
        </Stack>


        <Stack spacing={2} justifyContent="center" sx={{ mt: 2, mb: 3 }}>
          <Button type="submit" variant="contained" onClick={() => swupdate(1.01)} endIcon={<SendIcon />}>
            프로그램업데이트 git pull
          </Button>
        </Stack>

        <Stack spacing={2} justifyContent="center" sx={{ mt: 2, mb: 3 }}>
          <Button type="submit" variant="contained" onClick={() => swupdate(9.01)} endIcon={<SendIcon />}>
            프로그램업데이트 backend npm install
          </Button>
        </Stack>

        <Stack spacing={2} justifyContent="center" sx={{ mt: 2, mb: 3 }}>
          <Button type="submit" variant="contained" onClick={() => swupdate(1.91)} endIcon={<SendIcon />}>
            프로그램업데이트 frontend npm install
          </Button>
        </Stack>
        <Stack spacing={2} justifyContent="center" sx={{ mt: 2, mb: 3 }}>
          <Button type="submit" variant="contained" onClick={() => swupdate(9.91)} endIcon={<SendIcon />}>
            프로그램업데이트 backend and frontend 
          </Button>
        </Stack>

        
        <Stack spacing={2} justifyContent="center" sx={{ mt: 2, mb: 3 }}>
          <Button type="submit" variant="contained" onClick={() => readdevicelog()} endIcon={<SendIcon />}>
            시스템 로그 보기
          </Button>
        </Stack>
        

        <Stack spacing={2} justifyContent="center" sx={{ mt: 2, mb: 3 }}>
          <Button type="submit" variant="contained" onClick={() => shellcmdtodevice()} endIcon={<SendIcon />}>
            시스템 명령어 테스트
          </Button>
        </Stack>

        

        

      </ThemeProvider>
    </Box>
  );
}
