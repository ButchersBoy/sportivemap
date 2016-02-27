import { connect } from 'react-redux'
import { setSideBarVisibility, Visibility } from '../actions'
import SideBarLink from '../components/SideBarLink'

const mapStateToProps = (state, ownProps) => {
    console.log(state)    
    return {
        isVisible: ownProps.sideBarVisibility == Visibility.SHOW
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: () => {
            console.log("mapDispatchToProps")
            dispatch(setSideBarVisibility(ownProps.sideBarVisibility));
        }
    }
}

const SideBarLinkContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBarLink)

export default SideBarLinkContainer