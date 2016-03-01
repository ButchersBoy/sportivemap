import Moment from 'moment'

//action types

export const SET_SIDEBAR_VISIBILITY = 'SET_SIDEBAR_VISIBILITY'
export const ADD_EVENT = 'ADD_EVENT'
export const FILTER_EVENT_DATE = 'FILTER_EVENT_DATE'
export const SELECT_EVENT = 'SELECT_EVENT'
export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT'

//other constants

export const Visibility = {
    SHOW: 'SHOW',
    HIDE: 'HIDE'
}

export class DateFilter {
    constructor(index, long, short, logic) {
        this.index = index
        this.long = long
        this.short = short
        this.logic = logic
    }
}

export const IsSearchMatch = (event, text) => {
    if (!text) return true
    text = text.trim()
    if (text.length == 0) return true
    let t = text.toLowerCase()    
    return event.name.toLowerCase().indexOf(t) >= 0 
        || event.formattedAddress.toLowerCase().indexOf(t) >= 0
        || event.locationSummary.toLowerCase().indexOf(t) >= 0
}

let isWithin = (d, m) => Moment(d).isSameOrAfter(Moment().startOf('day')) && Moment(d).isSameOrBefore(m);
export const DateFilterKind = {
    W1: new DateFilter(0, "1 Week", "1W", e => isWithin(e.date, Moment().add(1, "w"))),
    W2: new DateFilter(1, "2 Weeks", "2W", e => isWithin(e.date, Moment().add(2, "w"))),
    M1: new DateFilter(2, "1 Month", "1M", e => isWithin(e.date, Moment().add(1, "M"))),
    M3: new DateFilter(3, "3 Months", "3M", e  => isWithin(e.date, Moment().add(3, "M"))),
    M6: new DateFilter(4, "6 Months", "6M", e  => isWithin(e.date, Moment().add(6, "M"))),
    M9: new DateFilter(5, "9 Months", "9M", e  => isWithin(e.date, Moment().add(9, "M"))),
    Y1: new DateFilter(6, "1 Year", "1Y", e  => isWithin(e.date, Moment().add(1, "y")))
}

export const DateFilterKinds = [DateFilterKind.W1, DateFilterKind.W2, DateFilterKind.M1, DateFilterKind.M3, DateFilterKind.M6,  DateFilterKind.M9, DateFilterKind.Y1];

//action creators

export const setSideBarVisibility = (visibility) => {    
    return { type : SET_SIDEBAR_VISIBILITY, visibility}
}

export const setDateFilter = (kind) => {
    return { type : FILTER_EVENT_DATE, kind }
}

export const setSelectedEvent = (event) => {    
    return { type : SELECT_EVENT, event }
}

export const setSearchText = (text) => {
    return { type : SET_SEARCH_TEXT, text }    
}

//do we need?   maybe if we are starting store before initial ajax
let nextEventId = 0
export const addEvent = (event) => {
    return { type : ADD_EVENT, id: nextEventId++, event}
}


