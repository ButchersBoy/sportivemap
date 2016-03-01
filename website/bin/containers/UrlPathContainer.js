import { setSelectedEvent, setDateFilter, DateFilter } from '../actions/index'
import moment from 'moment'

/*

function processAjaxData(response, urlPath){
     document.getElementById("content").innerHTML = response.html;
     document.title = response.pageTitle;
     window.history.pushState({"html":response.html,"pageTitle":response.pageTitle},"", urlPath);
 }
 
 
 window.onpopstate = function(e){
    if(e.state){
        document.getElementById("content").innerHTML = e.state.html;
        document.title = e.state.pageTitle;
    }
};

*/

export default class UrlPathContainer {
	constructor(store, region) {
		this.store = store
		this.region = region
	}
	init() {
		let pathParts = window.location.pathname.split("/");
		if (pathParts.length > 0 && pathParts[0] == "")
			pathParts.shift();
		if (pathParts.length >= 2 && pathParts[0].toLowerCase() == "uk") {
			if (pathParts[1].toLowerCase() == "e" && pathParts.length == 4) {
				let date = moment(pathParts[2], "YYYY-MM-DD");
				if (date.isValid())
				{
					let name = pathParts[3];					
					let events = this.store.getState().events;
					
					for (var index = 0; index < events.length; index++) {
						var element = events[index];
						if (moment(element.date).startOf('day').isSame(date)
							&& name == element.namePath) {
																			
							this.store.dispatch(setDateFilter(new DateFilter(9999, 9999, 9999, e => e == element)))
							this.store.dispatch(setSelectedEvent(element))
							
							break                            
						}                    
					}                                        
				}                
			}            
		}
		this.store.subscribe(() => {
			this.buildUrl(this.store.getState())
		})
	}
	buildUrl(state) {		
		if (state.selectedEvent)
		{			
			let date = moment(state.selectedEvent.date).format('YYYY-MM-DD')
			let path = "/" + this.region + "/e/" + date + "/" + state.selectedEvent.namePath						
			window.history.pushState({}, null, path)
		}				
		else
		{			
			window.history.pushState({}, null, "/")
		}				
	}	
}