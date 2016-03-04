import React from 'react'
import ReactDOM from 'react-dom'
import Maintenance from './components/Maintenance'

function newEvent(name, date, url, email, address) {
	this.name = name 
	this.date = date 
	this.url = url
	this.email = email
	this.address = address
	
}




ReactDOM.render(
	<Maintenance />,
	document.getElementById('form')   
)



$(document).ready(() => {

	/*	
	$("#form-new").submit(e => {
				
		
		
		alert( "Handler for form-new called." );
		event.preventDefault();
	});
	
	$("#form-correction").submit(e => {
		alert( "Handler for form-correction called." );
		event.preventDefault();
	});
	
	*/
	console.log($('.menu .item').size())	
    //$('.menu .item').tab()	
})


