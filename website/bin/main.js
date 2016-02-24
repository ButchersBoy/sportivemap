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



class DateFilterItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  handleButtonClick(e) {
    this.props.onClick(this.props.logicalIndex);
  }
  render() {
    var className = "ui toggle button";
    if (this.props.isSelected)
      className += " positive"; 
    return (
      <button className={className} onClick={e => this.handleButtonClick(e)}>
        {this.props.description}
      </button>);
  }
}

class DateFilter extends React.Component {
  constructor(props) {
    super(props);    
    this.handleDateFilterItemClick = this.handleDateFilterItemClick.bind(this);
    this.state = {selectedIndex : 3}
  }
  handleDateFilterItemClick(logicalIndex) {
    this.setState({selectedIndex : logicalIndex});    
  }
  render() {
    console.log("Rendering..."+this.state.selectedIndex);
    var nodes = [
      ["1 Week"],
      ["2 Weeks"],
      ["1 Month"],
      ["3 Months"],
      ["6 Months"],
      ["9 Months"],
      ["1 Year"]
    ].map((item, index) => {
      return (<DateFilterItem description={item[0]} key={index} 
                              logicalIndex={index}
                              isSelected={this.state.selectedIndex >= index}
                              onClick={this.handleDateFilterItemClick} />);
    });         
    return (
      <div className={"ui buttons"}>
        {nodes}
      </div>      
    );    
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
      ReactDOM.render(
        <DateFilter />,
        document.getElementById('dateFilter')        
      );
    });  
}

google.maps.event.addDomListener(window, 'load', initMap);

