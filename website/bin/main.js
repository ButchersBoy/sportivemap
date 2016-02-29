"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Moment = require('moment');

import { createStore } from 'redux';
import { Provider } from 'react-redux'
import app from './reducers/index';
import App from './components/App'

import { setSelectedEvent } from './actions/index'

class SportiveInfoWindow extends React.Component {
    render() {
        return (
            <div className={"ui"}>
                <div className={"header"}>{this.props.item.name}</div>
                <div>{Moment(this.props.item.date).format("dddd, MMMM Do YYYY")}</div>
                <div><a href={this.props.item.indexerUrl} target="_blank">Website</a></div>
            </div>);
    }
}

class MapContainer {
  constructor(elementId, geo, events, selectEventDispatcher) {
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
      this.selectEventDispatcher = selectEventDispatcher;      
      this.items = events.map((e, i) => {
        return { 
          event : e, 
          index : i,           
          marker : this.addMarker(e),                    
          isActive : false
          };        
      })
          
  }
  addMarker(event) {    
    var marker=new google.maps.Marker({
      position:new google.maps.LatLng(event.geometryLocation.lat, event.geometryLocation.lng),
      icon:'./images/coggy32.png'
    });    
    
    marker.addListener('click', () => {
      this.selectEventDispatcher(event);                  
    }, this);
    
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
  focus(event) {    
    if (this.activeInfoWindow)
    {
      this.activeInfoWindow.close();
      this.activeInfoWindow = null;
    }          
    if (event == null) return;
    for (var index = 0; index < this.items.length; index++) {
      if (this.items[index].event == event)
      {        
        //TODO only create this once per event!
        let elementId = "standard-info-window-" + index;
        let infoWindow = new google.maps.InfoWindow({
          content: '<div id="' + elementId + '"></div>'
        });
        infoWindow.open(this.map, this.items[index].marker);                  
        this.activeInfoWindow = infoWindow;         
        this.map.panTo(this.items[index].marker.getPosition());             

        var render = () => {
          var el = document.getElementById(elementId);
          if (!el) return false;
          ReactDOM.render(<SportiveInfoWindow item={this.items[index].event}/>, el);
          return true;
        }
        
        //Chrome/maps not ready on very first item...
        if (!render()) setTimeout(render, 10);
                   
        return;        
      }      
    }
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
        var mapContainer = new MapContainer(
          "googleMap", { lat: 54.0684078, lng: -2.0086898}, 
          store.getState().events, 
          e => store.dispatch(setSelectedEvent(e)));
        mapContainer.setFilter(store.getState().dateFilter);      
        
        let unsubscribe = store.subscribe(() => {
          console.log(store.getState())
          mapContainer.setFilter(store.getState().dateFilter)
          mapContainer.focus(store.getState().selectedEvent)
        })          
    });
}


google.maps.event.addDomListener(window, 'load', initMap);
