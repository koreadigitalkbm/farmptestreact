
const KDCommon = require("../common/commonjs/kdcommon");
//루프로 동작하는 함수에서 한개라도 에러가 발생하면 전체 함수를 재시작하기위해
var istaskStopByerror = false;


 function deviceInit() {
  console.log("------------deviceInit------------------- ");
  return "IF0001";
}


async function devicemaintask() {
  
  istaskStopByerror = false;
  console.log("------------main start-------------------");

  try {
    
    const promisearray = [modbusTask(), controltask() ];
    await Promise.all(promisearray);


    console.log("------------main stop -------------------");
  } catch (error) {
    istaskStopByerror = true;
    console.error("maintask error : " + error.toString());
  } finally {
    console.log("------------main stop by error-------------------");

    //에러발생시 다시시작
    setTimeout(maintask, 1000);
  }
}


async function modbusTask() {
  let modbusTask_count = 0;
  try {
    while (true) {
      if (istaskStopByerror == true) {
        return "modbusTask";
      }

      await KDCommon.delay(200);
      modbusTask_count++;
      console.log("modbusTask run: " + modbusTask_count);
    }
  } catch (error) {
    console.log("modbusTask : catch...... ");
    istaskStopByerror = true;
    throw error;
  }

  return "modbusTask";
}


async function controltask() {

  let sec_count=0;

  try {
    while (true) {
      await KDCommon.delay(1000);
      sec_count++;
      console.log("controltask run: " + sec_count);
    }
  } catch (error) {
    console.log("controltask : catch...... ");
    istaskStopByerror = true;
    throw error;
  }

  return "controltask";
}

exports.deviceInit = deviceInit;
exports.devicemaintask = devicemaintask;
