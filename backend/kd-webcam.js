


/**

    설치 (설치되어져 있을듯 )
    sudo apt-get update
    sudo apt-get install fswebcam
    sudo npm install node-schedule --save
    sudo npm install shelljs --save


 */



'use strict';


const colors = require('colors');
const moment = require('moment');

let shell = require('shelljs');
var schedule = require('node-schedule');

// ============================================================================= job pm2 flush
// ==========        sudo pm2 flush
// ============================================================================= job pm2 flush
//let Job_Get_Image = new schedule.scheduleJob( '0 */1 * * * *' , function () { 
    try {
//        console.log( '   '.bgMagenta, 'now run pm2 flush command' );
        let _cmd = `fswebcam -r 1280*960 --no-banner /home/pi/kd/farmptestreact/common/usbcamimage.jpg`
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



