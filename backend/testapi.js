
const fs = require("fs");
const os = require("os");



const responseMessage = require("../common/commonjs/responseMessage");
var backGlobal = require("./backGlobal");




var exec = require("child_process").exec;


var isresponse=false;

function postapi(req, rsp) {
  
  let reqmsg = JSON.parse(JSON.stringify(req.body));

  console.log("---------------------------------postapi :  puniqid :"  + reqmsg.puniqid);
  //console.log(req.body);

  //console.log("---------------------------------postapi :  sensor :"  + reqmsg.getSensors+ " ,getOutputport:  " + reqmsg.getOutputport);
  let rspmsg = msgprocessing(reqmsg);

  rsp.send(JSON.stringify(rspmsg));

}


function sleep(msec) {
  return new Promise(resolve => setTimeout(resolve, msec ));
} 

async function Delaymsec(msec) {
  console.log("----Delaymsec start");
  await sleep(msec);
  console.log("---- Delaymsec end"); 

  
}

function wait(msec) {
  let start = Date.now(), now = start;
  while (now - start < msec) {
      now = Date.now();
  }
}


// 서버로 요청하면 디바이스로 요청한다. 파이어베이스 리얼타임디비를 사용하여 메시지를 터널링한다.
async function postapifordevice(req, rsp) {
  

  isresponse =false;
  console.log("---------------------------------postapifordevice :  isresponse :"  + isresponse);

 
let objJsonB64encode = Buffer.from(JSON.stringify(req.body)).toString("base64");
backGlobal.fblocalrequst.set(objJsonB64encode);

  


  for(var i=0;i<50;i++)
  {
    await sleep(100);
    console.log("---------------------------------for i:"+i+ "  isresponse :"  + isresponse);
  }




  //console.log(req.body);

  //console.log("---------------------------------postapi :  sensor :"  + reqmsg.getSensors+ " ,getOutputport:  " + reqmsg.getOutputport);
  //let rspmsg = msgprocessing(reqmsg);
  
  console.log("---------------------------------fetchItems end : "  + isresponse);
  
  
  let rspmsg = new responseMessage();

  
  rsp.send(JSON.stringify(rspmsg));        


}




function msgprocessing(reqmsg)
{

  let rspmsg = new responseMessage();

  if(reqmsg.reqType == "getlocaldeviceid")
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
/*
      backGlobal.fblocalresponse.on("value", (snapshot) => {
        const data = snapshot.val();

            console.log("frebase 8877 ...event... data: "+ data);
            
        
      });
*/
     // let frrequest = backGlobal.fbdatabase.ref("IFDevices/IF0001/request");
      //frrequest.set("backedn fbtest");

    }
    else{
      rspmsg.retMessage="admin";
    }
    rspmsg.IsOK = true;


  }
  
  console.log("msgprocessing   return :  " + rspmsg.IsOK );
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

    
  
  async function firebasedbtest() {
  
   console.log("firebasedbtest : ");


    
var admin = require("firebase-admin");

var serviceAccount = require("../common/private/farmcube-push-firebase-adminsdk-z8u93-e5d8d4f325.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://farmcube-push.firebaseio.com"
});


    backGlobal.fbdatabase = admin.database();

    //console.log(admin);
    //console.log(database);


    backGlobal.fblocalrequst = backGlobal.fbdatabase.ref("IFDevices/IF0001/request");
    backGlobal.fblocalresponse = backGlobal.fbdatabase.ref("IFDevices/IF0001/response");

    
    
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




    backGlobal.fblocalrequst.on("value", (snapshot) => {
        const data = snapshot.val();


        console.log("frebase frrequest ...event... data: "+ data);

        try {
          let decodedStr = Buffer.from(data, 'base64'); 
                var reqmsg= JSON.parse( decodedStr );
                let rspmsg = msgprocessing(reqmsg);
                let objJsonB64encode = Buffer.from(JSON.stringify(rspmsg)).toString("base64");
              backGlobal.fblocalresponse.set(objJsonB64encode);

      } catch (e) {
          return false;
      }

        
        
/*


           //let reqmsg = JSON.parse(JSON.stringify(data));
            console.log("frebase frrequest ...event... datar: "+ reqmsg.reqType);
            
            let rspmsg = msgprocessing(reqmsg);

            
            

            let objJsonB64encode = Buffer.from(JSON.stringify(rspmsg)).toString("base64");

            backGlobal.fblocalresponse.set(objJsonB64encode);
*/
            
            
            
            
        
      });


      
      


    
   //   backGlobal.fblocalrequst.set("backedn req1");
  //   frresponse.set("backend rep1");


  
  }


exports.postapi = postapi;
exports.postapifordevice = postapifordevice;
exports.firebasedbtest = firebasedbtest;

