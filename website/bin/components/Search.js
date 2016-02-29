import React, { PropTypes } from 'react'

const Search = ({onChange}) => {
    return (
        <div className={"ui search"}>
			<div className={"ui icon input"}>
				<input className={"prompt"} type="text" placeholder="Search..."
						onChange={e => onChange(e.target.value)} />
				<i className={"search icon"}></i>
			</div>                            
		</div>
    );    
}

Search.propTypes = {
  onChange: PropTypes.func.isRequired
}

export default Search