import React, { PropTypes } from 'react'

const SideBarLink = ({onClick}) => {
    return (
        <a href="#" onClick={e => {
           e.preventDefault()
           onClick() 
        }}>
            MENU!
        </a>        
    );    
}

SideBarLink.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default SideBarLink