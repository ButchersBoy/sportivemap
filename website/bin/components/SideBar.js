import React, { PropTypes } from 'react'
import SideBarItem from './SideBarItem'

const SideBar = (events, visibility, onEventClick) => (
    <div onClick={onEventClick}>
        {events.map((event, index) =>
            <SideBarItem key=index {...event} />
        )}
    </div>
)

export default SideBar