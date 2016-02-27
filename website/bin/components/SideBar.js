import React, { PropTypes } from 'react'
import SideBarItem from './SideBarItem'

const SideBar = ({isVisible, onEventClick}) => (
    <div onClick={onEventClick}>
        <span>"SIDE BAR BITCHES!" + {isVisible}</span>
    </div>
)

export default SideBar