import { connect } from 'react-redux'
import { setSideBarVisibility, Visibility } from '../actions'
import SideBarLink from '../components/SideBarLink'

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: () => {
            $('.ui.sidebar')
                .sidebar('setting', 'transition', 'overlay')
                .sidebar('toggle');           
            //TODO decide which way we are going to do this!!! 
            dispatch(setSideBarVisibility(Visibility.SHOW));            
                        
        }
    }
}

const SideBarLinkContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SideBarLink)

export default SideBarLinkContainer