import React from 'react'
import SideBar from './SideBar'
import FilteredEventList from '../containers/FilteredEventList'
import SideBarLinkContainer from '../containers/SideBarLinkContainer'

const App = () => (
    <div>
        <FilteredEventList />
        <SideBarLinkContainer />
    </div>
)

export default App;