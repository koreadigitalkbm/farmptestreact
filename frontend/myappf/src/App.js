import logo from './logo.svg';
import './App.css';
import myAppGlobal from "./myAppGlobal";

function App() {
  console.log("-------------------------react APP start---------------------");
  console.log("Hostname : " +window.location.hostname + ",host : " + window.location.protocol);
  

  if (window.location.hostname.indexOf("amazonaws.com") != -1  || window.location.hostname.indexOf("13.209.26.2") != -1 ) {
//서버 IP이거나 도메인이 서버이면 서버접속임.
    myAppGlobal.islocal = false;
    myAppGlobal.isuseradmin = false;
    console.log("-------------------------connected aws server---------------------");
    
  } else {
    ///로컬로 접속하면 관리자 계정임
    myAppGlobal.islocal = true;
    myAppGlobal.isuseradmin = true;
    console.log("-------------------------connected local network---------------------");
  }



  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React kbm
        </a>
      </header>
    </div>
  );
}

export default App;
