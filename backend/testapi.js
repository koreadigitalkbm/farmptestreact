
const fs = require("fs");
const os = require("os");



const responseMessage = require("../common/commonjs/responseMessage");





var exec = require("child_process").exec;



function postapi(req, rsp) {
  
  let reqmsg = JSON.parse(JSON.stringify(req.body));

  console.log("---------------------------------postapi :  puniqid :"  + reqmsg.puniqid);
  //console.log(req.body);

  //console.log("---------------------------------postapi :  sensor :"  + reqmsg.getSensors+ " ,getOutputport:  " + reqmsg.getOutputport);

  let rspmsg = msgprocessing(reqmsg);

  rsp.send(JSON.stringify(rspmsg));

}


function msgprocessing(reqmsg)
{

  let rspmsg = new responseMessage();

  if (reqmsg.loginPW)
  {
    console.log("setlogin   pw:  " + reqmsg.loginPW);

    if(reqmsg.loginPW === "8877")
    {
      rspmsg.retMessage="factory";
    }
    else{
      rspmsg.retMessage="admin";
    }
    rspmsg.IsOK = true;


  }
  

  return rspmsg;
}


/*
function postapi() {
  
    
  
    console.log("postapi  up1:"  );
    child = exec("git reset --hard HEAD ", function (error, stdout, stderr) {
        console.log('stdout reset: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });

    child = exec("git pull ", function (error, stdout, stderr) {
        console.log('stdout pull: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('exec error: ' + error);
        }
    });
  

  
  }
*/

  
const firebaseConfig = {
    apiKey: "AIzaSyDscCzBnKTvU80sNVhsJl70XacS76LZW6Q",
    authDomain: "farmcube-push.firebaseapp.com",
    databaseURL: "https://farmcube-push.firebaseio.com",
    projectId: "farmcube-push",
    storageBucket: "farmcube-push.appspot.com",
    messagingSenderId: "425829899473",
    appId: "1:425829899473:web:4ec0495b00d2907eec39f0"
  };
  
  
  async function firebasedbtest() {
  
    console.log("firebasedbtest : ");


    

    

    

    
var admin = require("firebase-admin");

var serviceAccount = require("../common/private/farmcube-push-firebase-adminsdk-z8u93-e5d8d4f325.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://farmcube-push.firebaseio.com"
});


    
    console.log(admin);

    var database = admin.database();
    console.log(database);





    let frrequest = database.ref("IFDevices/IF0001/request");
    let frresponse = database.ref("IFDevices/IF0001/response");

    
    frresponse.on("value", (snapshot) => {
        const data = snapshot.val();

            console.log("resposemsg ...event...");
            console.log(data);
        
      });


    
     frrequest.set("backedn req1");
     frresponse.set("backend rep1");


  
  }


exports.postapi = postapi;
exports.firebasedbtest = firebasedbtest;

