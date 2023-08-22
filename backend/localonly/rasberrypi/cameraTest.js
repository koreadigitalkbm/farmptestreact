


const PiCamera = require("pi-camera");
const color = require('colors');


let search_root_dir_index = __dirname.split('/').indexOf('farmptestreact'); 
let _dirPath = '';

if ( search_root_dir_index !== -1 ) {
    console.log(' full directroy is : ', __dirname );
    _dirPath = __dirname.split('/').slice(0, search_root_dir_index + 1 ).join('/');
    console.log( _dirPath );
    _dirPath += '/common/ctestimage.jpg'
    console.log( _dirPath );

    const myCamera = new PiCamera({
        mode        : 'photo',
        output      : _dirPath,
        width       : 640,
        height      : 480,
        nopreview   : true,
    });

    myCamera
        .snap()
        .then((result) => {

            console.log("       ".bgCyan, "Capturimage() OK !!!");
            console.log( result.length )
            console.log( result )
            // return KDCommon.ReadfileBase64("../../common/ctestimage.jpg");
            // Your picture was captured
        })
        .catch((error) => {
            // Handle your error
            console.log("       ".bgMagenta, "Capturimage()", error);
            return null;
        });
}
else {
    console.log( _dirPath, '경로가 없습니다.' );
    return null;
}






// if( __dirname.split('/').indexOf('farmptestreact') !== -1) {

//     let _dir = 

//     const myCamera = new PiCamera({
//         mode: "photo",
//         output: "../../common/test.jpg",
//         width: 640,
//         height: 480,
//         nopreview: true,
//       });
      
//       myCamera
//         .snap()
//         .then((result) => {
      
      
      
      
//           console.log("       ".bgCyan, "Captureimage() OK !!!");
      
      
      
//           // return KDCommon.ReadfileBase64("../../common/ctestimage.jpg");
//           // Your picture was captured
//         })
//         .catch((error) => {
//           // Handle your error
//           console.log("       ".bgMagenta, "Captureimage()", error);
//           return null;
//         });

// }
// else {
//     return null;
// }




