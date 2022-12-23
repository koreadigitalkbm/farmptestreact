export const SETVALUE = 'SETVALUE';
export const SETLOGIN = 'SETLOGIN';
export const SETSYSINFO = 'SETSYSINFO';

export const actionSetvalue= (intvalue) => {
    return {
        intvalue,
        type: 'SETVALUE'
    }
}


export const actionSetlogin = (LoginRole) => {
    console.log(" actionSetlogin LoginRole :  " + LoginRole);
    return {
        LoginRole,
        type: 'SETLOGIN'
    }
}
export const actionSetSysteminfo = (Systeminfo) => {
    console.log(" actionSetSysteminfo Systeminfo :  " + Systeminfo);
    return {
        Systeminfo,
        type: 'SETSYSINFO'
    }
}