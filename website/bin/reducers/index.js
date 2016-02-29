import { combineReducers }  from 'redux';
//TODO move these items from actions/index into their own actions file
import { SET_SIDEBAR_VISIBILITY, ADD_EVENT, SELECT_EVENT, FILTER_EVENT_DATE, Visibility } from '../actions/index';
import dateFilter from './dateFilter';
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

const selectedEvent = (state = null, action) => {    
    switch (action.type) {
        case SELECT_EVENT:
            return action.event;
        case FILTER_EVENT_DATE:
            return null;
        default:
            return state
    }
}

const app = combineReducers({
    sideBarVisibility, events, dateFilter, selectedEvent
})

export default app;