import React from 'react'

class DateFilterItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }
  handleButtonClick(e) {
    this.props.onClick();
  }
  render() {
    var className = "ui button";
    if (this.props.isSelected)
      className += " positive"; 
    return (
      <button className={className} onClick={e => this.handleButtonClick(e)}>
        <span>{this.props.description}</span>        
      </button>);
  }
}

export default class DateFilter extends React.Component {
  constructor(props) {
    super(props);    
    this.handleDateFilterItemClick = this.handleDateFilterItemClick.bind(this);    
  }
  handleDateFilterItemClick(item) {
    this.props.onFilterClick(item);
  }
  render() {       
    var isWithin = (d, m) => Moment(d).isSameOrBefore(m); 
    var bigNodes = this.props.allFilters.map((item) => {
      return (<DateFilterItem description={item.long}                               
                              key={item.index}                               
                              isSelected={this.props.selectedFilter.index >= item.index}
                              onClick={() => this.handleDateFilterItemClick(item)} />);
    });   
    var littleNodes = this.props.allFilters.map((item) => {
      return (<DateFilterItem description={item.short}
                              key={item.index}                               
                              isSelected={this.props.selectedFilter.index >= item.index}
                              onClick={() => this.handleDateFilterItemClick(item)} />);
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