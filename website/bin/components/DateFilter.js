import React from 'react'

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
        <span>{this.props.description}</span>        
      </button>);
  }
}

export default class DateFilter extends React.Component {
  constructor(props) {
    super(props);    
    this.handleDateFilterItemClick = this.handleDateFilterItemClick.bind(this);
    this.state = {selectedIndex : this.props.selectedFilter.index};
  }
  handleDateFilterItemClick(item) {
    this.props.onFilterClick(item);
  }
  render() {    
    var isWithin = (d, m) => Moment(d).isSameOrBefore(m); 
    var bigNodes = this.props.dateFilters.map((item) => {
      return (<DateFilterItem description={item.long}                               
                              key={item.index} 
                              index={item.index}
                              isSelected={this.state.selectedIndex >= item.index}
                              onClick={() => this.handleDateFilterItemClick(item)} />);
    });   
    var littleNodes = this.props.dateFilters.map((item) => {
      return (<DateFilterItem description={item.short}
                              key={item.index} 
                              index={item.index}
                              isSelected={this.state.selectedIndex >= item.index}
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