import React from 'react'
import ReactDOM from 'react-dom'
import { setSelectedEvent, IsSearchMatch } from '../actions/index'
import SportiveInfoWindow from '../components/SportiveInfoWindow'
import Moment from 'moment'

export default class MapContainer {
  constructor(elementId, geo, events, dispatcher) {
      this.elementId = elementId;
      this.dispatcher = dispatcher;
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
      this.items = events.filter(ev => ev.geometryLocation).map((e, i) => {
        return { 
          event : e, 
          index : i,           
          marker : this.addMarker(e),                    
          isVisible : false,
          infoWindow : null
          };        
      })
          
  }
  addMarker(event) {    
    var marker=new google.maps.Marker({
      position:new google.maps.LatLng(event.geometryLocation.lat, event.geometryLocation.lng),
      icon:'/images/coggy32.png'
    });    
    
    marker.addListener('click', () => {
      this.dispatcher(setSelectedEvent(event));                  
    }, this);
    
    return marker;   
  }    
  setFilter(dateFilter, text) {
    this.items.forEach(i => {
      if (dateFilter.logic(i.event) && IsSearchMatch(i.event, text))
      {
        if (!i.isVisible) {
          i.marker.setMap(this.map);
          i.isVisible = true;
        }
      }
      else
      { 
        if (i.isVisible) {            
          if (this.activeEvent && this.activeEvent.event == i.event)
          {            
            this.dispatcher(setSelectedEvent(null));
          }          
          i.marker.setMap(null);          
          i.isVisible = false;
        }        
      }      
    })    
  }
  focus(event) {    
    if (this.activeEvent && this.activeEvent.event != event)
    {      
      this.activeEvent.infoWindow.close();
      this.activeEvent = null;
    }          
    if (event == null) return;
    for (var index = 0; index < this.items.length; index++) {
      if (this.items[index].event == event)
      {        
        //TODO only create this once per event!
        let elementId = "standard-info-window-" + index;
                        
        let infoWindow = this.items[index].infoWindow;
        if (!infoWindow) {          
          infoWindow = new google.maps.InfoWindow({
            content: '<div id="' + elementId + '"></div>'
          });
          this.items[index].infoWindow = infoWindow          
        }                
        infoWindow.open(this.map, this.items[index].marker);                  
        this.activeEvent = { infoWindow, event : this.items[index].event};         
        this.map.panTo(this.items[index].marker.getPosition());             

        var render = (retries, max) => {
          var el = document.getElementById(elementId);
          if (!el) {
            if (retries++ < max) setTimeout(() => render(retries, max), 100)
            return
          };
          ReactDOM.render(<SportiveInfoWindow item={this.items[index].event}/>, el)
          return true
        }
        
        //Chrome/maps not ready on very first item...
        render(0, 3);
                   
        return;        
      }      
    }
  }
  panTo(marker) {
      this.map.panTo(marker.getPosition());
  }
}