import React, { useState, useEffect } from "react";
import myAppGlobal from "../myAppGlobal";



const Dashboard = (props) => {
  const [loginresult, setLoginresult] = useState("결과")
  const [currentDeviceName, setCurrentDeviceName] = useState("현재이름")
  const [currentDeviceID, setCurrentDeviceID] = useState(myAppGlobal.logindeviceid)
  let loginid;
  let loginpw;
  let logintype;
  let newDeviceName;
  let newDeviceID;
  let newDevicePW;

  console.log("------------------Loginpage----------------- islocal :" + myAppGlobal.islocal + " props.Islogin :" + props.Islogin);



  if (myAppGlobal.islocal === false) {
    logintype = (
      <div className="content">
        <label>ID: </label>
        <input type="text" key="1235" name="inputloginid" onChange={inputonchangeHandler} />
        <div>
          <label>암호: </label>
          <input type="text" key="1234" name="inputloginpw" onChange={inputonchangeHandler} />
          <button className="" onClick={loginbuttonHandler}>
            로그인
          </button>

        </div>
      </div>
    );
  } else {
    logintype = (
      <div className="">
        <label>간편로그인(로컬): </label>

        <div>
          <label>암호: </label>
          <input type="text" key="1234" name="inputloginpw" onChange={inputonchangeHandler} />
          <button className="" onClick={loginbuttonHandler}>
            로그인
          </button>
        </div>

        <div>
          <label>현재 기기이름: </label>
          {currentDeviceName}
          <br></br>
          <label>현재 기기ID: </label>
          {currentDeviceID}
          <br></br>
        </div>
        

        <div>
          <label>새 기기이름: </label>
          <input type="text" name='inputNewDeviceName' onChange={inputonchangeHandler} />
          <br></br>
          <label>새 디바이스ID: </label>
          <input type="text" name='inputNewDeviceID' onChange={inputonchangeHandler} />
          <br></br>
          <label>새 패스워드: </label>
          <input type="text" name='inputNewDevicePW' onChange={inputonchangeHandler} />
          <br></br>
          <button classname="" onClick={setMyInfoHandler}>
            로그인정보 변경
          </button>
          <br></br>

        </div>

      </div>
    );
  }

  function initMyInfo() {
    setCurrentDeviceID(myAppGlobal.logindeviceid)
  }

  function checkIDRule() {

  }

  function inputonchangeHandler(e) {
    switch (e.target.name) {
      case "inputloginid":
        loginid = e.target.value;
        break;

      case "inputloginpw":
        loginpw = e.target.value;
        break;

      case 'inputNewDeviceName':
        newDeviceName = e.target.value;
        break;

      case 'inputNewDeviceID':
        newDeviceID = e.target.value;
        break;

      case 'inputNewDevicePW':
        newDevicePW = e.target.value;
        break;
      default:
        console.log('입력오류 발생');
    }
  }

  function loginbuttonHandler(e) {
    console.log("loginbuttonHandler : " + e.target.name + " id : " + loginid + " , pw : " + loginpw);

    myAppGlobal.farmapi.setLogin(loginid, loginpw).then((ret) => {
      if (ret) {
        if (ret.IsOK === true) {
          console.log(" login ret msg: " + ret.retMessage + " ,param:" + ret.retParam);

          if (ret.retMessage === "not" || ret.retMessage === "notid" || ret.retMessage === "notpw") {
            console.log("실패");
            setLoginresult("장비에 접속할수 없습니다.")
          }
          else {
            console.log("성공");
            setLoginresult("로그인 성공")
            window.sessionStorage.setItem("login", ret.retMessage);
            window.sessionStorage.setItem("deviceid", ret.retParam);
            myAppGlobal.logindeviceid = ret.retParam;
          }
        }
      }
    });
  }

  function setMyInfoHandler(e) {
    myAppGlobal.farmapi.setMyInfo(newDeviceName, newDeviceID, newDevicePW).then((ret) => {
      if (ret) {
        if (ret.IsOK === true) {
          if (ret.retMessage === 'ok') {
           
           console.log('변경완료!');
            setLoginresult('변경완료!');
          }
          else {
            console.log('error Code: 3920');
          }
        }
        else {
          console.log('error Code: 3921');
        }
      }
    })
  }

  return (
    <div>
      <h2>Dash Board</h2>
      <div key="sdaff">{logintype}</div>
      <div>
        <p></p>
        {loginresult}
      </div>

    </div>
  );
}
export default Dashboard;