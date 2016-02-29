import React from 'react'
import FilteredEventList from '../containers/FilteredEventList'
import DateFilterContainer from '../containers/DateFilterContainer'
import SideBarLinkContainer from '../containers/SideBarLinkContainer'

const App = () => (    
    <div className={"ui pushable"} id="app-container">
        <div className={"ui sidebar"}>            
            <FilteredEventList  />
        </div>        
        <div className={"pusher"}>        
            <div className={"ui container"}>
                <div className={"header"}>                
                    <h1>Sportive Map</h1>            
                    <span>Sportives in the next:</span>
                    <DateFilterContainer />
                    
                    <SideBarLinkContainer />
                </div>
                <div id="googleMap"></div>            
            </div>        	
        </div>                                        
    </div>
)

export default App;