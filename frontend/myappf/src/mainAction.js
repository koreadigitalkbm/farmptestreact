export const SETVALUE = 'SETVALUE';
export const SETLOGIN = 'SETLOGIN';

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