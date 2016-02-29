"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Moment = require('moment');

import { createStore } from 'redux';
import { Provider } from 'react-redux'
import app from './reducers/index';
import App from './components/App'

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
          marker : this.addMarker(e.geometryLocation, i, 
            el => ReactDOM.render(<SportiveInfoWindow item={e}/>, el)),
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
    if (this.activeInfoWindow)
    {
      this.activeInfoWindow.close();
      this.activeInfoWindow = null;
    }
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
    for (var index = 0; index < this.items.length; index++) {
      if (this.items[index].event == event)
      {
        this.map.panTo(this.items[index].marker.getPosition());
        google.maps.event.trigger(this.items[index].marker, 'click');
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
        var mapContainer = new MapContainer("googleMap", { lat: 54.0684078, lng: -2.0086898}, store.getState().events);
        mapContainer.setFilter(store.getState().dateFilter);      
        
        let unsubscribe = store.subscribe(() => {
          console.log(store.getState())
          mapContainer.setFilter(store.getState().dateFilter)
          mapContainer.focus(store.getState().selectedEvent)
        })          
    });
}


google.maps.event.addDomListener(window, 'load', initMap);
