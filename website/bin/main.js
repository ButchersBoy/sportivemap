"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Moment = require('moment');

class Sportive extends React.Component {
  componentWillUnmount() {
    this.marker.setMap(null);
  }
  componentDidMount() {
    this.marker = this.props.mapContainer.addMarker(this.props.item.geometryLocation, this.props.item.name);
  }
  render() {                        
    return (
        <div>
            <div>{this.props.item.name}</div>
            <div>{this.props.item.date}</div>
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
    this.props.onClick(this.props.logicalIndex, this.props.filter);
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
  handleDateFilterItemClick(logicalIndex, filter) {
    this.props.onFilterSelected(filter);
    this.setState({selectedIndex : logicalIndex});    
  }
  render() {    
    var isWithin = (d, m) => Moment(d).isSameOrBefore(m); 
    var nodes = [
      ["1 Week", d => isWithin(d, Moment().add(1, "w"))],
      ["2 Weeks", d => isWithin(d, Moment().add(2, "w"))],
      ["1 Month", d => isWithin(d, Moment().add(1, "M"))],
      ["3 Months", d => isWithin(d, Moment().add(3, "M"))],
      ["6 Months", d => isWithin(d, Moment().add(6, "M"))],
      ["9 Months", d => isWithin(d, Moment().add(9, "M"))],
      ["1 Year", d => isWithin(d, Moment().add(1, "y"))]
    ].map((item, index) => {
      return (<DateFilterItem description={item[0]} key={index} 
                              logicalIndex={index}
                              filter={item[1]}
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
        center:new google.maps.LatLng(54.0684078,-2.0086898),
        zoom:6,
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
    
    return marker;   
  }    
}

class Store {
  constructor(data) {
    this.master = data;
  }
  filter(dateFilter) {
    
    if (dateFilter)
    {      
      var filtered = new Array();
      this.master.forEach(function(element) {
        if (dateFilter(element.date))
          filtered.push(element);
      }, this);
      return filtered;      
    }
    
    return this.master;
  }  
}

function renderAllSportives(store, mapContainer, filter) {
  console.log(filter);
        
  var data = store.filter(filter);
  
  ReactDOM.render(
        <SportiveList data={data} mapContainer={mapContainer} />,
        document.getElementById('sportiveList')
      );
}

function initMap() {
  var mapContainer = new MapContainer("googleMap", { lat: 51.508742, lng: -0.120850});
  $.post("api/list/uk")
    .done(function(data) {
      
      var store = new Store(data);
      renderAllSportives(store, mapContainer);
      
      ReactDOM.render(
        <DateFilter onFilterSelected={f => renderAllSportives(store, mapContainer, f) } />,
        document.getElementById('dateFilter')        
      );
    });  
}

google.maps.event.addDomListener(window, 'load', initMap);

