
import { SETVALUE, SETLOGIN,SETSYSINFO } from './mainAction';

const initState = {
    LoginRole : "none",
    Systeminfo: null,
    intvalue: 0
    
}
 
function mainReducer(state = initState, actions) 
{
    switch(actions.type){
        case SETVALUE:
            return state = {
                ...state,
                intvalue  : actions.intvalue
            };
        case SETLOGIN:
            return state = {
                ...state,
                LoginRole : actions.LoginRole
            };
        case SETSYSINFO:
            return state = {
                ...state,
                Systeminfo : actions.Systeminfo
            };
        default:
            return state;
    }
}

export default mainReducer;
