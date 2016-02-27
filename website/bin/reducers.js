import { combineReducers }  from 'redux';
import {  SET_SIDEBAR_VISIBILITY, Visibility} from './actions';
const { SHOW } = Visibility;

function sideBarvisibilityFilter(state = SHOW, action)  {
    switch (action.type) {
        case SET_SIDEBAR_VISIBILITY:
            return action.visibility;
        default:
            return state;
    }
}

const app = combineReducers({
    sideBarvisibilityFilter
})

export default app;