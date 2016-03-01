import React, { PropTypes } from 'react'

const Search = ({onChange, text}) => {	
    return (
        <div className={"ui search"}>
			<div className={"ui icon input"}>
				<input className={"prompt"} type="text" placeholder="Search..."
						value={text}
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