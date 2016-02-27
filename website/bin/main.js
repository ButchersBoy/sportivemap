"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var Moment = require('moment');

import { createStore } from 'redux';
import { Provider } from 'react-redux'
import app from './reducers/index';
import App from './components/App'

let store =  createStore(app);

class SportiveInfoCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleMarkerClick = this.handleMarkerClick.bind(this);
    }
    handleMarkerClick() {
        this.props.onMarkerClick();
    }
    render() {
        return (
            <div className={"ui centered card"}>
                <div className={"content clickable"}  onClick={this.handleMarkerClick}>
                    <i className={"right floated marker icon"}></i>
                    <div className={"header"}>{this.props.item.name}</div>
                </div>
                <div className={"content"}>
                    <div>{Moment(this.props.item.date).format("dddd, MMMM Do YYYY")}</div>
                    <div><a href={this.props.item.indexerUrl} target="_blank">Website</a></div>
                </div>                               
            </div>);
    }
}

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

class Sportive extends React.Component {
    constructor(props) {
        super(props);
        this.handleCardMarkerClick = this.handleCardMarkerClick.bind(this);
    }
  handleCardMarkerClick() {
      this.props.mapContainer.panTo(this.marker);
      google.maps.event.trigger(this.marker, 'click');
  }
  componentWillUnmount() {
    this.marker.setMap(null);
  }
  componentDidMount() {
    this.marker = this.props.mapContainer.addMarker(
        this.props.item.geometryLocation,
        this.props.index, 
        el => ReactDOM.render(<SportiveInfoWindow item={this.props.item}/>, el)
        );
  }
  render() {                        
    return (<SportiveInfoCard item={this.props.item} onMarkerClick={this.handleCardMarkerClick}/>);
  }
}

class SportiveList extends React.Component {
  render() {    
    var nodes = this.props.data.map(function(sportive, index) {
      return (<Sportive key={index} index={index} item={sportive}  mapContainer={this.props.mapContainer} />);      
    }, this);
    return (<div className={"sportiveListNodes"}>{nodes}</div>);
  }
}

class DateFilterItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  handleButtonClick(e) {
    this.props.onClick(this.props.index, this.props.filter);
  }
  render() {
    var className = "ui button";
    if (this.props.isSelected)
      className += " positive"; 
    return (
      <button className={className} onClick={e => this.handleButtonClick(e)}>
        <span >{this.props.description}</span>        
      </button>);
  }
}

class DateFilter extends React.Component {
  constructor(props) {
    super(props);    
    this.handleDateFilterItemClick = this.handleDateFilterItemClick.bind(this);
    this.state = {selectedIndex : this.props.selectedIndex};
  }
  handleDateFilterItemClick(index) {
    this.props.onFilterSelected(index);
    this.setState({selectedIndex : index})
  }
  render() {    
    var isWithin = (d, m) => Moment(d).isSameOrBefore(m); 
    var bigNodes = this.props.dateFilterOps.map((item, index) => {
      return (<DateFilterItem description={item.description}                               
                              key={index} 
                              index={index}
                              isSelected={this.state.selectedIndex >= index}
                              onClick={this.handleDateFilterItemClick} />);
    });   
    var littleNodes = this.props.dateFilterOps.map((item, index) => {
      return (<DateFilterItem description={item.code}
                              key={index} 
                              index={index}
                              isSelected={this.state.selectedIndex >= index}
                              onClick={this.handleDateFilterItemClick} />);
    });         
    return (
      <div>
        <div className={"media-long"}>
          <div className={"ui buttons"}>
            {bigNodes}
          </div>
        </div>
        <div className={"media-short"}>
          <div className={"mini ui buttons"}>
            {littleNodes}
          </div>
        </div>    
      </div>  
    );    
  }  
} 


class MapContainer {
  constructor(elementId, geo) {
    	var mapProps = {
        center:new google.maps.LatLng(54.0684078,-2.0086898),
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
    
    marker.setMap(this.map); 
    
    return marker;   
  }    
  panTo(marker) {
      this.map.panTo(marker.getPosition());
  }
}

class DateFilterOp {
    constructor(description, code, filter) {
        this.description = description;
        this.code = code;
        this.filter = filter;
    }
}

class Store {
  constructor(data) {
    this.master = data;
    var isWithin = (d, m) => Moment(d).isSameOrBefore(m); 
    this.dateFilterOps = [
      new DateFilterOp("1 Week", "1W", d => isWithin(d, Moment().add(1, "w"))),
      new DateFilterOp("2 Weeks", "2W", d => isWithin(d, Moment().add(2, "w"))),
      new DateFilterOp("1 Month", "1M", d => isWithin(d, Moment().add(1, "M"))),
      new DateFilterOp("3 Months", "3M", d => isWithin(d, Moment().add(3, "M"))),
      new DateFilterOp("6 Months", "6M", d => isWithin(d, Moment().add(6, "M"))),
      new DateFilterOp("9 Months", "9M", d => isWithin(d, Moment().add(9, "M"))),
      new DateFilterOp("1 Year", "1Y", d => isWithin(d, Moment().add(1, "y")))
    ];
  }
  filter(index) {
    let filter = this.dateFilterOps[index].filter;      
    var filtered = new Array();
    this.master.forEach(function(element) {
        if (filter(element.date))
            filtered.push(element);
        }, this);
    return filtered;      
  }  
}

function renderAllSportives(store, mapContainer, filterIndex) {
       
  var data = store.filter(filterIndex);
  
  ReactDOM.render(
        <SportiveList data={data} mapContainer={mapContainer} />,
        document.getElementById('sportiveList')
      );
}

function initMap() {  
  $.post("api/list/uk")
    .done(function(data) {
      var mapContainer = new MapContainer("googleMap", { lat: 51.508742, lng: -0.120850});
      let store = new Store(data);
      let filterIndex = 2;
      renderAllSportives(store, mapContainer, filterIndex);
      
      ReactDOM.render(
        <DateFilter dateFilterOps={store.dateFilterOps}
                    selectedIndex={filterIndex} 
                    onFilterSelected={fi => renderAllSportives(store, mapContainer, fi) } />,
        document.getElementById('dateFilter')        
      );
    });  
}

//google.maps.event.addDomListener(window, 'load', initMap);
console.log(store.getState());
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')    
)


/*
let unsubscribe = store.subscribe(() =>
  console.log(store.getState())
)
store.dispatch(setSideBarVisibility(Visibility.SHOW))
store.dispatch(setSideBarVisibility(Visibility.HIDE))
store.dispatch(setSideBarVisibility(Visibility.SHOW))

unsubscribe()
*/

