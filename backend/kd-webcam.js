


/**

    설치 (설치되어져 있을듯 )
    sudo apt-get update
    sudo apt-get install fswebcam
    sudo npm install node-schedule --save
    sudo npm install shelljs --save


 */



'use strict';

const KDCommon = require("./kdcommon");




async function Captureimage(miskpc480, isusbwecam) {
      
    let shell = require('shelljs');

    if(isusbwecam== true)
    {
      console.log(" usb webcam  mode start ");
    
      let _cmd = `fswebcam -r 1280*960 --no-banner /home/pi/kd/farmptestreact/frontend/myappf/public/usbcamimage.jpg`
            if (shell.exec(`${ _cmd }`).code === 0) {
                console.log('done !!! get image',  );
            }
            else {
                console.log('failed !!! get image',  );
            }
    
    
      await KDCommon.delay(5000);
    
      console.log(" usb webcam  mode wait 5sec.. ");
    
      let data_img = KDCommon.ReadfileBase64( '/home/pi/kd/farmptestreact/frontend/myappf/public/usbcamimage.jpg' );
    
      if( data_img.length >1000)
      {
        console.log(" usb data_img =%d " +data_img.length );
    
        return data_img;
      }
      return null;
    
    }
    return null;

}

 Captureimage(true, true);




/*
//scp usbcamimage.jpg root@127.0.0.1:"C:\user\abc"
// ============================================================================= job pm2 flush
// ==========        sudo pm2 flush
// ============================================================================= job pm2 flush

    try {
//        console.log( '   '.bgMagenta, 'now run pm2 flush command' );

const PiCamera = require("pi-camera");
       //kbm 카메라 해상도 조정 
        let myCamera = new PiCamera({
          mode: "photo",
          output: '/home/pi/kd/farmptestreact/frontend/myappf/public/comsimage.jpg',
          width: 1600,
          height: 1200,
          quality : 70,
          
          shutter : 3000,
          nopreview: true,
        });
       
        console.log('======================= 1 start pi-camera', '/home/pi/kd/farmptestreact/common/ctestimage2.jpg')
  
          myCamera.snap()
          .then((data) => {    // data << 이미지 데이타가 아님... 
            //let data_img = KDCommon.ReadfileBase64( '/home/pi/kd/farmptestreact/common/ctestimage2.jpg' );
            //console.log(" data : " + data_img.length);
            
            //"data:image/jpg;base64," 문자열 제거
            
            
   
          })
          .catch((error) => {
            // Handle your error
            console.log("       ".bgMagenta, "Captureimage()", error);
            
          });

          console.log('======================= 2 start usb-camera', '/home/pi/kd/farmptestreact/common/ctestimage2.jpg')

        let _cmd = `fswebcam -r 1280*960 --no-banner /home/pi/kd/farmptestreact/frontend/myappf/public/usbcamimage.jpg`
        if (shell.exec(`${ _cmd }`).code === 0) {
            console.log('done !!! get image',  );
        }
        else {
            console.log('failed !!! get image',  );
        }
    } 
    catch (error) {
        console.log( error )        
    }
//});



*/