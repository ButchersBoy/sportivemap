import React from 'react'
import Moment from 'moment'

export default class SportiveInfoWindow extends React.Component {
    render() {
        return (
            <div className={"ui"}>
                <div className={"info-detail"}>
                    <div className={"header"}>{this.props.item.name}</div>
                    <div>{Moment(this.props.item.date).format("dddd, MMMM Do YYYY")}</div>
                    <div>{this.props.item.formattedAddress}</div>               
                    <div><a href={this.props.item.indexerUrl} target="_blank">Website</a></div>
                </div>
                <div className={"info-advert"}>
                    <a href="https://www.awin1.com/cread.php?s=228086&v=1857&q=113306&r=267983">
                        <img src="https://www.awin1.com/cshow.php?s=228086&v=1857&q=113306&r=267983" border="0" />
                    </a>
                </div>                                                                
            </div>);
    }
}