
const fs = require("fs");
const os = require("os");



const responseMessage = require("../common/commonjs/responseMessage");
var backGlobal = require("./backGlobal");
var exec = require("child_process").exec;


var isresponse=false;


function postapi(req, rsp) 
{
  
  let reqmsg = JSON.parse(JSON.stringify(req.body));
  console.log("---------------------------------postapi :  puniqid :"  + reqmsg.puniqid);
  let rspmsg = msgprocessing_serveronly(reqmsg);
  rsp.send(JSON.stringify(rspmsg));
}


function sleep(msec) {
  return new Promise(resolve => setTimeout(resolve, msec ));
} 




// 서버로 요청하면 디바이스로 요청한다. 파이어베이스 리얼타임디비를 사용하여 메시지를 터널링한다.
async function postapifordevice(req, rsp) {
  

  let jsonstr=JSON.stringify(req.body);
  let reqmsg ;
  //기본 nak 메시지로 만듬.
  let responsemsg = new responseMessage();
  

  isresponse =false;
  console.log("---------------------------------postapifordevice :  isresponse :"  + isresponse + ", backGlobal.islocal :"+backGlobal.islocal );

 

if( backGlobal.islocal == true)
{
  
  reqmsg = JSON.parse(jsonstr);
  responsemsg = msgprocessing_deviceonly(reqmsg);
  
}
else{

  

  let reqkey ;
  let repskey;
  let repsdata;

  reqkey =  backGlobal.fbdatabase.ref("IFDevices/IF0001/request");
  repskey = backGlobal.fbdatabase.ref("IFDevices/IF0001/response");
  
  let objJsonB64encode = Buffer.from(jsonstr).toString("base64");
  repskey.set("");
  reqkey.set(objJsonB64encode);
  
  
  for(var i=0;i<10;i++)
  {
    await sleep(200);
    await repskey.get().then((snapshot) => {
      if (snapshot.exists()) {
        repsdata = snapshot.val();
        console.log("farebase i:"+i+",get :" + repsdata + " repsdatalenght :"+ repsdata.length);

        if(repsdata.length >0)
        {
          try {
            let decodedStr = Buffer.from(repsdata, 'base64'); 
            responsemsg= JSON.parse( decodedStr );
            i=10000;//loop out
            isresponse=true;
              } catch (e) {
                  console.log("No data base64 decode error: "+e);
            }
          }
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
    console.log("---------------------------------for i:"+i+ "  isresponse :"  + isresponse);

  }


  console.log("---------------------------------fetchItems end : "  + responsemsg.datetime);

}
 

    
  
  rsp.send(JSON.stringify(responsemsg));        


}


function msgprocessing_deviceonly(reqmsg)
{

  let rspmsg = new responseMessage();

  
  if(reqmsg.reqType == "setswupdate")
  {

    rspmsg.retMessage=softwareupdatefromgit();
    rspmsg.IsOK = true;
  }
  else if(reqmsg.reqType == "getdeviceinfo")
  {
   
    rspmsg.retMessage=backGlobal.platformversion;
    rspmsg.IsOK = true;
  }
  else if(reqmsg.reqType == "getlocaldeviceid")
  {
   
    rspmsg.retMessage=backGlobal.mylocaldeviceid;
    rspmsg.IsOK = true;
  }
  
  console.log("msgprocessing_deviceonly   return :  " + rspmsg.IsOK );
  return rspmsg;
}

//////////////////////
function msgprocessing_serveronly(reqmsg)
{

  let rspmsg = new responseMessage();

  if(reqmsg.reqType == "getdeviceinfo")
  {
   
    rspmsg.retMessage=backGlobal.platformversion;
    rspmsg.IsOK = true;
  }

  else if(reqmsg.reqType == "getlocaldeviceid")
  {
   
    rspmsg.retMessage=backGlobal.mylocaldeviceid;
    rspmsg.IsOK = true;
  }
  else if (reqmsg.loginPW)
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
  
  console.log("msgprocessing   return :  " + rspmsg.IsOK );
  return rspmsg;
}



function softwareupdatefromgit() {
  
    
  console.log("softwareupdatefromgit  up1:"  );
  
  child = exec("dir ", function (error, stdout, stderr) {
      console.log('stdout pull: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
          console.log('exec error: ' + error);
      }

      return stdout;
  });



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

async function firebasedbinit() {
  
  console.log("firebasedbinit : ");
   
  var admin = require("firebase-admin");
  var serviceAccount = require("../common/private/farmcube-push-firebase-adminsdk-z8u93-e5d8d4f325.json");
  admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://farmcube-push.firebaseio.com"
  });

   backGlobal.fbdatabase = admin.database();
}
    

  
  async function firebasedbtest() {
  
   console.log("firebasedbtest : ");


    backGlobal.fblocalrequst = backGlobal.fbdatabase.ref("IFDevices/IF0001/request");
    backGlobal.fblocalresponse = backGlobal.fbdatabase.ref("IFDevices/IF0001/response");

    /*
    
  backGlobal.fblocalresponse.on("value", (snapshot) => {
    const data = snapshot.val();

    console.log("frebase fblocalresponse ...event... data: "+data );


    try {
        let decodedStr = Buffer.from(data, 'base64'); 
            var rspm= JSON.parse( decodedStr );
            console.log("frebase fblocalresponse ...event... datarr: "+ rspm.datetime);
            wait(1000);
            isresponse=true;

  } catch (e) {
      return false;
  }

        
    
  });

*/


    backGlobal.fblocalrequst.on("value", (snapshot) => {
        const data = snapshot.val();
        console.log("frebase frrequest local on event... data: "+ data);

        try {
                let decodedStr = Buffer.from(data, 'base64'); 
                var reqmsg= JSON.parse( decodedStr );
                let rspmsg = msgprocessing_deviceonly(reqmsg);
                let objJsonB64encode = Buffer.from(JSON.stringify(rspmsg)).toString("base64");
              backGlobal.fblocalresponse.set(objJsonB64encode);

      } catch (e) {
          return false;
      }
      });



  
  }


exports.postapi = postapi;
exports.postapifordevice = postapifordevice;
exports.firebasedbtest = firebasedbtest;
exports.firebasedbinit = firebasedbinit;

