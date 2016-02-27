import { combineReducers }  from 'redux';
import {  SET_SIDEBAR_VISIBILITY, Visibility} from '../actions/index';
const { HIDE } = Visibility;

function sideBarVisibility(state = HIDE, action)  {    
    console.log("action " + action)
    switch (action.type) {
        case SET_SIDEBAR_VISIBILITY:
            return action.visibility;
        default:
            return state;
    }
}

const app = combineReducers({
    sideBarVisibility
})

export default app;