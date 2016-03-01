"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
import MapContainer from './containers/MapContainer'
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import app from './reducers/index';
import App from './components/App'

function initMap() {
  $.post("api/list/uk")
    .done(function(data) {
        let appData = {
            events:data
        }
        let store =  createStore(app, appData);
        console.log(store.getState())
                
        ReactDOM.render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.getElementById('root')    
        )
        var mapContainer = new MapContainer(
          "googleMap", { lat: 54.0684078, lng: -2.0086898}, 
          store.getState().events,
          store.dispatch);
        mapContainer.setFilter(store.getState().dateFilter);      
        
        let unsubscribe = store.subscribe(() => {
          let s = store.getState();
          console.log(s)
          mapContainer.focus(s.selectedEvent)
          mapContainer.setFilter(s.dateFilter, s.searchText)          
        })          
    });
}


google.maps.event.addDomListener(window, 'load', initMap);
