import React, { useState,useEffect } from "react"

import myAppGlobal from "../../myAppGlobal"
import DeviceSystemconfig from "../../commonjs/devsystemconfig"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const SettingPage = (props) => {

  console.log("-------------------------SettingPage---------------------Systeminfo : " + props.Systeminfo);

  const [systestinfo, setTestinfo] = useState(null)
  const [changeMyInfoResult, setChangeMyInfoResult] = useState("결과")
  const [currentDeviceName, setCurrentDeviceName] = useState("")
  const [currentDeviceID, setCurrentDeviceID] = useState("")
  const [currentComport, setCurrentComport] = useState("")
  const currentPassword = '******'
  const currentProductName = '패밀리 이름'
  const currentProductModel = '모델 이름'

  useEffect(() => {
  
    console.log("SettingPage useEffect : "+props.Systeminfo );

    if(props.Systeminfo !=null)
    {
      setTestinfo(props.Systeminfo);
      setCurrentDeviceName(myAppGlobal.systeminformations.Systemconfg.productname);
      setCurrentComport(myAppGlobal.systeminformations.Systemconfg.comport);
    }
  }, [props.Systeminfo]);




  let myCurrentInfo
  let myNewInfo
  let newDeviceName
  let newDeviceID
  let newComport
  let newPassword

  myCurrentInfo = (
    <div className="currentMyInfo">
      <Typography variant="h3">나의 정보{systestinfo}</Typography>

      <div>
        <table>
          <tr>
            <th>기기닉네임</th>
            <td>{currentDeviceName}</td>
          </tr>
          <tr>
            <th>comport</th>
            <td>{currentComport}</td>
          </tr>
          <tr>
            <th>기기ID</th>
            <td>{currentDeviceID}</td>
          </tr>
          <tr>
            <th>패스워드</th>
            <td>{currentPassword}</td>
          </tr>
          <tr>
            <th>브랜드명</th>
            <td>{currentProductName}</td>
          </tr>
          <tr>
            <th>기기모델명</th>
            <td>{currentProductModel}</td>
          </tr>
        </table>
      </div>
    </div>
  );

  myNewInfo = (
    <div className="newMyInfo">
      <h3>정보 수정</h3>
      <table>
        <tr>
          <th>새 기기닉네임</th>
          <td><input type="text" name='inputNewDeviceName' value={currentDeviceName} onChange={inputonchangeHandler} /></td>
        </tr>
        <tr>
          <th>comport</th>
          <td><input type="text" name='inputNewComport' value={currentComport} onChange={inputonchangeHandler} /></td>
        </tr>
        <tr>
          <th>새 디바이스ID:</th>
          <td><input type="text" name='inputNewDeviceID' value={currentDeviceID} onChange={inputonchangeHandler} /></td>
        </tr>
        <tr>
          <th>새 패스워드:</th>
          <td><input type="text" name='inputNewDevicePW' onChange={inputonchangeHandler} /></td>
        </tr>
        <tr>
          <td colSpan={'2'} align={'center'}>
            <button className="ddff" onClick={setMyInfoHandler}>
              <h4>변경하기</h4>
            </button>
          </td>
        </tr>
      </table>
    </div>
  );

  function inputonchangeHandler(e) {
    switch (e.target.name) {
      case 'inputNewDeviceName':
        newDeviceName = e.target.value;
        break;

      case 'inputNewComport':
        newComport = e.target.value;
        break;

      case 'inputNewDeviceID':
        newDeviceID = e.target.value;
        break;

      case 'inputNewDevicePW':
        newPassword = e.target.value;
        break;

      default:
        console.log('입력오류 발생');
    }
  }

  function setMyInfoHandler(e) {
    let newconf = new DeviceSystemconfig();

    newconf.name = "ghfh";
    newconf.deviceuniqid = myAppGlobal.systeminformations.Systemconfg.deviceuniqid;
    newconf.comport = myAppGlobal.systeminformations.Systemconfg.comport;
    newconf.password = myAppGlobal.systeminformations.Systemconfg.password;
    newconf.productname = myAppGlobal.systeminformations.Systemconfg.productname;
    newconf.productmodel = myAppGlobal.systeminformations.Systemconfg.productmodel;

    myAppGlobal.farmapi.setMyInfo(newconf).then((ret) => {
      if (ret) {
        if (ret.IsOK === true) {
          if (ret.retMessage === 'ok') {
            setChangeMyInfoResult('변경완료!');
            setCurrentDeviceName(newDeviceName);
            setCurrentDeviceID(newDeviceID);
            setCurrentComport(newComport);
          }
          else {
            setChangeMyInfoResult('에러발생! code: 3920');
          }
        }
        else {
          setChangeMyInfoResult('에러발생! code: 3921');
        }
      }
    })
  }

  function setupss() {
    console.log("-------------------------setupss---------------------systestinfo : " + props.Systeminfo);
    if(props.Systeminfo ==null)
    {
      return <div> nodata... </div>

    }
    else
{
  return (

    <Box>
          {myCurrentInfo}
          {myNewInfo}
          {changeMyInfoResult}
    </Box>
  );
}

}
    

  
  return (   <div>{setupss()}</div>
  );
}
export default SettingPage;