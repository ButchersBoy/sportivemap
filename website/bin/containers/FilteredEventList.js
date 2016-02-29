import { connect } from 'react-redux'
import { ADD_EVENT, addEvent, setSelectedEvent, IsSearchMatch } from '../actions/index.js'
import EventList from '../components/EventList.js'


const getVisibleEvents = (events, dateFilter, searchText) => {        
    return events.filter(e => dateFilter.logic(e.date) && IsSearchMatch(e, searchText));
}

const mapStateToProps = (state) => {
    return {events : getVisibleEvents(state.events, state.dateFilter, state.searchText)}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClick : (item) => dispatch(setSelectedEvent(item))
    }    
}

const FilteredEventList = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventList)

export default FilteredEventList