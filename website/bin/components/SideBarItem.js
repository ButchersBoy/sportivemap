import React from 'react'

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

export default SportiveInfoCard