//REDUX

//action types
export const SET_SIDEBAR_VISIBILITY = 'SET_SIDEBAR_VISIBILITY'

//other constants
export const Visibility = {
    SHOW: 'SHOW',
    HIDE: 'HIDE'
}

//action creators
export function setSideBarVisibility(visibility) {
    console.log("ACTION FACT " + visibility)
    return { type : SET_SIDEBAR_VISIBILITY, visibility}
}

