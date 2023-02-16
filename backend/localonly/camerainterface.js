//카메라 촬영 관련  인터페이스 클래스
const KDDefine = require("../../frontend/myappf/src/commonjs/kddefine");
const KDCommon = require("../kdcommon");

const os = require("os");


const RasCamera =require("./rasberrypi/cmoscamera");
const USBCamera = require("./windows/usbcamera");



module.exports = class CameraInterface {
  constructor() {
   
  }
  

  static  async Captureimage(main, filepath, filename) {

    let data_img;
    if (os.platform() === "win32") {
//      data_img = KDCommon.ReadfileBase64('../common/ctestimage.jpg')
        data_img = await USBCamera.Captureimage();


    } else {

      data_img = await RasCamera.Captureimage();
    }

    console.log('----------- CameraInterface Captureimage end' );

    return data_img;
    

  }


};



/*

const color = require('colors');
const PiCamera = require("pi-camera");



// async function CameraInterface() {
//   // ...
// }
// module.exports.CameraInterface = CameraInterface;


// function Get_My_Camera_Path ( project_name ) {
//   // let search_root_dir_index = __dirname.split('/').indexOf( 'farmptestreact' ); 
//   let search_root_dir_index = __dirname.split('/').indexOf( project_name ); 
//   let _dirPath = '';
//   if ( search_root_dir_index !== -1 ) {
//       console.log(' full directroy is : ', __dirname );
//       _dirPath = __dirname.split('/').slice(0, search_root_dir_index + 1 ).join('/');
//       console.log( _dirPath );
//       _dirPath += '/common/ctestimage.jpg'
//       console.log( _dirPath );
//       return _dirPath;

//   }
//   else {
//       console.log( _dirPath, '경로가 없습니다.' );
//       return '';
//   }
// }



// ==============================================
// =======         original code          =======
// ==============================================

module.exports = class CameraInterface {
  constructor() {
    console.log('======================= start heere'.bgGreen )
    this.path = '';
  }

  // this.path = Get_My_Camera_Path('farmptestreact');
  imgPath() {
    console.log('======================= start path')
    let project_name = 'farmptestreact';
    // let search_root_dir_index = __dirname.split('/').indexOf( 'farmptestreact' ); 
    let search_root_dir_index = __dirname.split('/').indexOf(project_name);
    let _dirPath = '';
    if (search_root_dir_index !== -1) {
      console.log(' full directroy is : ', __dirname);
      _dirPath = __dirname.split('/').slice(0, search_root_dir_index + 1).join('/');
      console.log(_dirPath);
      _dirPath += '/common/ctestimage.jpg'
      console.log(_dirPath);
      return _dirPath;

    }
    else {
      console.log(_dirPath, '경로가 없습니다.');
      return '';
    }
  }



  static Captureimage(main, filepath, filename) {
    // let path = imgPath();

    if (os.platform() === "win32") {
      let data_img = KDCommon.ReadfileBase64('../../common/ctestimage.jpg')

      console.log( data_img.length )
      KDCommon.removeallfiles(filepath);
      KDCommon.mkdirRecursive(filepath);
      filepath = filepath + filename;
      KDCommon.WritefileBase64(filepath, data_img);
      /// 썸네일 이미지도 만들자 나중에
      filepath = filepath.replace(".jpg", "_thum.jpg");
      KDCommon.WritefileBase64(filepath, data_img);
      //서버로 보냄
      main.mAPI.setcameradatatoserver(main.mydeviceuniqid, "time", 1, filename, data_img, false);
      return KDCommon.ReadfileBase64('../../common/ctestimage.jpg');

    } else {
      const myCamera = new PiCamera({
        mode: "photo",
        output: '/home/pi/kd/farmptestreact/common/ctestimage.jpg',
        width: 640,
        height: 480,
        nopreview: true,
      });
      console.log('======================= 1 start pi-camera', '/home/pi/kd/farmptestreact/common/ctestimage.jpg')

      myCamera.snap()
        .then( async (data) => {    // data << 이미지 데이타가 아님... 
          console.log("       2 ".bgCyan, "Captureimage() in snap() !!!");
          let data_img = KDCommon.ReadfileBase64('/home/pi/kd/farmptestreact/common/ctestimage.jpg')

          setTimeout( async () => {
            console.log( data_img.length )
            // return KDCommon.ReadfileBase64( '/home/pi/kd/farmptestreact/common/ctestimage.jpg' ); 
            // // Your picture was captured
            KDCommon.removeallfiles(filepath);
            KDCommon.mkdirRecursive(filepath);
            filepath = filepath + filename;
            KDCommon.WritefileBase64(filepath, data_img);
            /// 썸네일 이미지도 만들자 나중에
            filepath = filepath.replace(".jpg", "_thum.jpg");
            KDCommon.WritefileBase64(filepath, data_img);
            console.log("       3 ".bgCyan, "done myCamera.snap() !!!", data_img.length);
  
            //서버로 보냄
            console.log('       4 '.bgCyan, data_img.length )
            await main.mAPI.setcameradatatoserver(main.mydeviceuniqid, "time", 1, filename, data_img, false);
            console.log('       5 '.bgCyan, 'sent to server OK')
            console.log('       6 file size is : '.bgCyan, data_img.length);
            return data_img;
              
          }, 7000);




          // console.log("       2 ".bgCyan, "Captureimage() in snap() !!!");
          // let capture_file = KDCommon.ReadfileBase64('/home/pi/kd/farmptestreact/common/ctestimage.jpg');

          // // return KDCommon.ReadfileBase64( '/home/pi/kd/farmptestreact/common/ctestimage.jpg' ); 
          // // // Your picture was captured
          // KDCommon.removeallfiles(filepath);
          // KDCommon.mkdirRecursive(filepath);
          // filepath = filepath + filename;
          // KDCommon.WritefileBase64(filepath, capture_file);
          // /// 썸네일 이미지도 만들자 나중에
          // filepath = filepath.replace(".jpg", "_thum.jpg");
          // KDCommon.WritefileBase64(filepath, capture_file);
          // console.log("       3 ".bgCyan, "done myCamera.snap() !!!", capture_file.length);



          // //서버로 보냄
          // console.log('       4 '.bgCyan, capture_file.length )
          // await main.mAPI.setcameradatatoserver(main.mydeviceuniqid, "time", 1, filename, capture_file, false);
          // console.log('       5 '.bgCyan, 'sent to server OK')
          // console.log('       6 file size is : '.bgCyan, capture_file.length);
          // return capture_file;

        })
        .catch((error) => {
          // Handle your error
          console.log("       ".bgMagenta, "Captureimage()", error);
          return null;
        });
    }
  }


  // // 사진을 촬용하고  bin 데이터를 base64 인코딩해서 리턴함. ( 서버로  http 로 보내야함으로)
  // static Captureimage() {
  //   // let path = imgPath();

  //   if (os.platform() === "win32") {
  //     return KDCommon.ReadfileBase64( '../../common/ctestimage.jpg' );
      
  //   } else {
  //     const myCamera = new PiCamera({
  //       mode      : "photo",
  //       output    : '/home/pi/kd/farmptestreact/common/ctestimage.jpg',
  //       width     : 640,
  //       height    : 480,
  //       nopreview : true,
  //     });
  //     console.log( '======================= start pi-camera', '/home/pi/kd/farmptestreact/common/ctestimage.jpg' )

  //     myCamera.snap()
  //       .then( (result) => {
  //         console.log("       ".bgCyan, "Captureimage() in snap() !!!", result.length );
  //         return KDCommon.ReadfileBase64( '/home/pi/kd/farmptestreact/common/ctestimage.jpg' ); 
  //         // Your picture was captured
  //       })
  //       .catch((error) => {
  //         // Handle your error
  //         console.log("       ".bgMagenta, "Captureimage()", error);
  //         return null;
  //       });
  //   }
  // }
};
*/