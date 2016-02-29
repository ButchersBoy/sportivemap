import React, { PropTypes } from 'react'

const SideBarLink = ({onClick}) => {
    return (
        <div className={"item clickable"} id="listButton"
             onClick={e => onClick()}>
            <i className={"sidebar icon"}></i>
            List
        </div>
    );    
}

SideBarLink.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default SideBarLink