import { combineReducers }  from 'redux';
import { SET_SIDEBAR_VISIBILITY, ADD_EVENT, Visibility} from '../actions/index';
const { HIDE } = Visibility;

function sideBarVisibility(state = HIDE, action)  {        
    switch (action.type) {
        case SET_SIDEBAR_VISIBILITY:
            return action.visibility;
        default:
            return state;
    }
}

const event = (state, action) => {
    switch (action.type) {
        case ADD_EVENT:
            return {
                id: action.id,
                event: action.event,
            }
        default:
            return state
    } 
}

const events = (state = [], action) => {
    switch (action.type) {
        case ADD_EVENT:
            return [
                ...state,
                event(undefined, action)
            ]
        default:
            return state
    } 
}

const dateFilter = ()

const app = combineReducers({
    sideBarVisibility, events
})

export default app;