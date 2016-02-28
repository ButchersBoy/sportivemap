import React from 'react'
import Moment from 'moment'

export class EventInfoCard extends React.Component {
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

/*
class Event extends React.Component {
    constructor(props) {
        super(props);
        this.handleCardMarkerClick = this.handleCardMarkerClick.bind(this);
    }
  handleCardMarkerClick() {
      //this.props.mapContainer.panTo(this.marker);
      //google.maps.event.trigger(this.marker, 'click');
  }
  componentWillUnmount() {
    //this.marker.setMap(null);
  }
  componentDidMount() {
    this.marker = this.props.mapContainer.addMarker(
        this.props.item.geometryLocation,
        this.props.index, 
        el => ReactDOM.render(<SportiveInfoWindow item={this.props.item}/>, el)
        );
  }
  render() {                        
    return (<EventInfoCard item={this.props.item} onMarkerClick={this.handleCardMarkerClick}/>);
  }
}
*/

export default class EventList extends React.Component {
    render() {
        console.log("render " + this.props.events.length)
        console.log("render " + this.props)
        return (
            <div>
                {this.props.events.map((ev, i) => {
                    return <EventInfoCard key={i} item={ev} />  
                })}
            </div>
        )
    }    
}

