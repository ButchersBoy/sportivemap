"use strict";

var React = require('react');
var ReactDOM = require('react-dom');

class Sportive extends React.Component {
  render() {
    
    var geo = this.props.item.geometryLocation;
    console.log(geo);
    console.log(_map);    
    var marker=new google.maps.Marker({
      position:new google.maps.LatLng(geo.lat, geo.lng),
    });    
    
    marker.setMap(_map);
    
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
      return (<Sportive key={index} item={sportive} />);      
    });
    return (<div>{nodes}</div>);
  }
}

class MyMap {
  constructor() {
    
  }
}

$.post("api/list/uk")
  .done(function(data) {
    ReactDOM.render(
      <SportiveList data={data} />,
      document.getElementById('sportiveList')
    );
  });