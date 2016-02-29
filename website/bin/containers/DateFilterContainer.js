import { connect } from 'react-redux'
import { setDateFilter, DateFilterKinds } from '../actions/index'
import DateFilter from '../components/DateFilter'

const mapStateToProps = (state) => {    
    return {
        selectedFilter : state.dateFilter,
        allFilters : DateFilterKinds
        }
}

const mapDispatchToProps = (dispatch, o) => {
    return {
        onFilterClick : (item) => dispatch(setDateFilter(item))
    }    
}

const DateFilterContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(DateFilter)

export default DateFilterContainer