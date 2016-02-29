import React from 'react'
import SideBar from './SideBar'
import FilteredEventList from '../containers/FilteredEventList'
import DateFilterContainer from '../containers/DateFilterContainer'
import SideBarLinkContainer from '../containers/SideBarLinkContainer'

const App = () => (    
    <div>
        <div className={"ui sidebar"}>            
            <FilteredEventList />
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

                    /*
                    <div class="item clickable" id="listButton">
                        <i class="sidebar icon"></i>
                        List
                    </div>
                    */

export default App;