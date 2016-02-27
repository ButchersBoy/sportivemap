import { connect } from 'react-redux'
import { setSideBarVisibility, Visibility } from '../actions'
import SideBarLink from '../components/SideBarLink'

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: () => {            
            dispatch(setSideBarVisibility(Visibility.SHOW));
        }
    }
}

const SideBarLinkContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBarLink)

export default SideBarLinkContainer