import { connect } from 'react-redux'
import { ADD_EVENT, addEvent } from '../actions/index'
import DateFilter from '../components/DateFilter'

const mapStateToProps = (state) => {
    return {events : state.dateFilter}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onFilterSelected : dispatch()
    }    
}

const DateFilterContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DateFilter)

export default DateFilterContainer