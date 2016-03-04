import React from 'react'
import ReactDOM from 'react-dom'

Object.filter = function( obj, predicate) {
    var result = {}, key;

    for (key in obj) {
        if (obj.hasOwnProperty(key) && !predicate(key, obj[key])) {
            result[key] = obj[key];
        }
    }

    return result;
};

export default class Maintenance extends React.Component {
	constructor(props) {
        super(props)
		this.handleChange = this.handleChange.bind(this)
		this.handleNewEventSubmit = this.handleNewEventSubmit.bind(this)
		this.handleCorrectionSubmit = this.handleCorrectionSubmit.bind(this)
    }
	handleNewEventSubmit(e) {
		e.preventDefault()		
		let vals = Object.filter(this.state, (k, v) => k.startsWith("new-"))
		console.log("VALS " + JSON.stringify(vals))
	}
	handleCorrectionSubmit(e) {
		e.preventDefault()		
		let vals = Object.filter(this.state, (k, v) => k.startsWith("correction-"))
		console.log("VALS " + JSON.stringify(vals))		 	
	}
	handleChange(event) {
		var state = {};
		state[event.target.name] = event.target.value		
		this.setState(state)
	}
	componentDidMount() {
		$(ReactDOM.findDOMNode(this.refs.tabNewEvent)).tab()
		$(ReactDOM.findDOMNode(this.refs.tabCorrection)).tab()
	}
	render() { 
		return (
			<div>
				<div className={"ui pointing secondary menu"}>
					<a className={"item active"} data-tab="tab-new-event" ref="tabNewEvent">New Event</a>
					<a className={"item"} data-tab="tab-correction" ref="tabCorrection">Correction</a>				
				</div>
				<div className={"ui tab segment active"} data-tab="tab-new-event">				
					<form className={"ui form"} id="form-new">												
						<div className={"field"}>
							<label>Name</label>
							<div className={"ui labeled input"}>
								<input type="text" placeholder="Event name" name="newName" onChange={this.handleChange} />
							</div>
						</div>					
						<div className={"two fields"}>
							<div className={"field"}>
								<label>Date</label>
								<input type="text" placeholder="dd/mm/yyyy" name="newDate" onChange={this.handleChange} />
							</div>
							<div className={"field"}>
								<label>Website</label>						
								<input type="text" placeholder="URL"  name="newUrl" />
							</div>						
						</div>					
						<div className={"two fields"}>
							<div className={"field"}>
								<label>Email</label>
								<input type="text" placeholder="your@email.address" name="newEmail" onChange={this.handleChange} />
							</div>
						</div>
						<div className={"field"}>
							<label>Address</label>
							<textarea rows="2" placeholder="Start/assemble point address" name="newAddress" onChange={this.handleChange}></textarea>
						</div>				
						<button className={"ui button"} type="submit" onClick={this.handleNewEventSubmit}>Submit</button>																
					</form>
				</div>	    
				<div className={"ui tab segment"} data-tab="tab-correction">				
					<form className={"ui form"} id="form-correction">										
						<div className={"two fields"}>
							<div className={"field"}>
								<label>Name</label>
								<div className={"ui labeled input"}>
									<input type="text" placeholder="Event name" name="correctionName" onChange={this.handleChange} />
								</div>
							</div>
							<div className={"field"}>
								<label>Event Date</label>
								<input type="text" placeholder="dd/mm/yyyy" name="correctionDate" onChange={this.handleChange} />
							</div>
						</div>
						<div className={"field"}>
							<label>Sportive Map Event URL</label>
							<input type="text" placeholder="Path shown in your browser when you click on the event in Sportive Map" name="correctionSmUrl" onChange={this.handleChange} />
						</div>
						<div className={"field"}>
							<label>What's wrong?</label>
							<textarea rows="2" placeholder="Tell us what correction needs to be made" name="correctionDetail" onChange={this.handleChange}></textarea>
						</div>
						<button className={"ui button"} type="submit" onClick={this.handleCorrectionSubmit}>Submit</button>
					</form>
				</div>  
			</div>
		);
	}
}

