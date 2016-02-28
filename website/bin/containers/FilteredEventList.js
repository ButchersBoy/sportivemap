import { connect } from 'react-redux'
import { ADD_EVENT, addEvent } from '../actions/index.js'
import EventList from '../components/EventList.js'

const mapStateToProps = (state) => {
    return {events : state.events}
}

const mapDispatchToProps = (dispatch) => {
    return {}    
}

const FilteredEventList = connect(
    mapStateToProps,
    mapDispatchToProps
)(EventList)

export default FilteredEventList