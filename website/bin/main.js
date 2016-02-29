"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Moment = require('moment');

import { createStore } from 'redux';
import { Provider } from 'react-redux'
import app from './reducers/index';
import App from './components/App'

class MapContainer {
  constructor(elementId, geo, events) {
      this.elementId = elementId;
    	var mapProps = {
        center:new google.maps.LatLng(geo.lat,geo.lng),
        zoom:6,
        mapTypeId:google.maps.MapTypeId.TERRAIN,
        disableDefaultUI:true,
        panControl:true,
        zoomControl:true,
        mapTypeControl:true,
        scaleControl:true,
        streetViewControl:true,
        overviewMapControl:true,
        rotateControl:true
      };            
      this.map=new google.maps.Map(document.getElementById(elementId), mapProps);      
      this.items = events.map((e, i) => {
        return { 
          event : e, 
          index : i, 
          marker : this.addMarker(e.geometryLocation, i, () => {}),
          isActive : false
          };        
      })
          
  }
  addMarker(geo, index, renderer) {    
    var marker=new google.maps.Marker({
      position:new google.maps.LatLng(geo.lat, geo.lng),
      icon:'./images/coggy32.png'
    });
    var id = "info-window-" + index;
    var infoWindow = new google.maps.InfoWindow({
      content: '<div id="' + id + '"></div>'
    });
    marker.addListener('click', () => {
        if (this.activeInfoWindow)
            this.activeInfoWindow.close();
        infoWindow.open(this.map, marker);
        renderer(document.getElementById(id));
        this.activeInfoWindow = infoWindow; 
    });
    
    return marker;   
  }    
  setFilter(dateFilter) {
    this.items.forEach(i => {
      if (dateFilter.logic(i.event.date))
      {
        if (!i.isActive) {
          i.marker.setMap(this.map);
          i.isActive = true;
        }
      }
      else
      { 
        if (i.isActive) {
          i.marker.setMap(null);
          i.isActive = false;
        }        
      }      
    })
    
  }
  panTo(marker) {
      this.map.panTo(marker.getPosition());
  }
}

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
        var mapContainer = new MapContainer("googleMap", { lat: 54.0684078, lng: -2.0086898}, store.getState().events);
        mapContainer.setFilter(store.getState().dateFilter);      
        
        let unsubscribe = store.subscribe(() =>
          mapContainer.setFilter(store.getState().dateFilter)
        )          
    });
}


google.maps.event.addDomListener(window, 'load', initMap);
