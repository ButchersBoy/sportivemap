import { connect } from 'react-redux'
import { setSearchText } from '../actions'
import Search from '../components/Search'

const mapStateToProps = (state) => {
    return { text : state.searchText }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onChange: text => dispatch(setSearchText(text))     
    }
}

const SearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)

export default SearchContainer