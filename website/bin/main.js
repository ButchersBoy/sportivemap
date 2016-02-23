"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

class Sportive extends React.Component {
  render() {        
    this.props.mapContainer.addMarker(this.props.item.geometryLocation, this.props.item.name);        
    
    return (
        <div>
            <div>{this.props.item.name} - {this.props.item.date}</div>
        </div>
    );
  }
}

class SportiveList extends React.Component {
  render() {    
    var nodes = this.props.data.map(function(sportive, index) {
      return (<Sportive key={index} item={sportive}  mapContainer={this.props.mapContainer} />);      
    }, this);
    return (<div>{nodes}</div>);
  }
}

class MapContainer {
  constructor(elementId, geo) {
    	var mapProps = {
        center:new google.maps.LatLng(51.508742,-0.120850),
        zoom:5,
        mapTypeId:google.maps.MapTypeId.ROADMAP,
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
  }
  addMarker(geo, name) {    
    var marker=new google.maps.Marker({
      position:new google.maps.LatLng(geo.lat, geo.lng)
    });
    var infowindow = new google.maps.InfoWindow({
      content: '<div>' + name+ '</div>'
    });
    marker.addListener('click', function() {
      infowindow.open(this.map, marker);
    })
    
    marker.setMap(this.map);    
  }    
}

function initMap() {
  var mapContainer = new MapContainer("googleMap", { lat: 51.508742, lng: -0.120850});
  $.post("api/list/uk")
    .done(function(data) {
      ReactDOM.render(
        <SportiveList data={data} mapContainer={mapContainer} />,
        document.getElementById('sportiveList')
      );
    });  
}

google.maps.event.addDomListener(window, 'load', initMap);

