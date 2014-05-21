'use strict';

// Call this function when the page loads (the "ready" event)
$(document).ready(function() {
	initializePage();
})

/*
 * Function that is called when the document is ready.
 */

function initializePage() {
	// add any functionality and listeners you want here
	$("#email").click(profileEditClicked);
	$("#phone").click(profileEditClicked);
	$("#profession").click(profileEditClicked);
	$("#skills").click(profileEditClicked);
	$("#interests").click(profileEditClicked);
	$("#resume").click(profileEditClicked);
	$("#field").click(profileEditClicked);
	$("#yrs_experience").click(profileEditClicked);

	$("#company_name").click(profileEditClicked);
	$("#company_site").click(profileEditClicked);
	$("#co_email").click(profileEditClicked);
	$("#co_phone").click(profileEditClicked);
	$("#skills_wanted").click(profileEditClicked);
	$("#company_departments").click(profileEditClicked);
	$("#company_industry").click(profileEditClicked);
	$("#min_years").click(profileEditClicked);

  $("#sub").click(changeRequest);
  $("#sub_emp").click(emp_changeRequest);

}
function submit(e){
  return;
}
function profileEditClicked(e){
	  console.log(this.id);
    var disp = $("#" +this.id).text();
    disp = disp.replace(/:/g,'');
    console.log(disp);
    
    $("#item_change").html('<label class="item_change" id="'+this.id+'" >What would you like to change your '+ disp +' to?</label>');
  }

 function changeRequest(e, res)
 {
  console.log("in change request this.id = " + this.id);
  var to_change = $(".item_change").attr('id');
  var what_change = $("#to_change").val();

  console.log("to = " + to_change);
  console.log("what = " + what_change);
	e.preventDefault();
 	var json;
 	var str;
 	switch ( to_change )
 	{
 		case "email":
      console.log("message");
 			json = { "email" :what_change };
 			break;
 		case "phone": 			
 			json = { "phone" :what_change };
 			break;
 		case "profession":
 			json = { "profession" :what_change };
 			break;
 		case "skills": 			
 			json = { "skills" :what_change };
 			break;
  		case "interests":
 			json = { "interests" :what_change };
 			break;
 		case "resume": 			
 			json = { "resume" :what_change };
 			break;
 		case "field":
 			json = { "field" :what_change };
 			break;
 		case "yrs_experience":
 			json = { "yrs_experience" :what_change };
 			break;
 	}
 			
	$.post("/profile/bullshit", json , doneFunc);

 }

 function emp_changeRequest(e, res)
 {
 	console.log("in change request this.id = " + this.id);
	e.preventDefault();
  console.log("in change request this.id = " + this.id);
  var to_change = $(".item_change").attr('id');
  var what_change = $("#to_change").val();

  console.log("to = " + to_change);
  console.log("what = " + what_change);
 	var json;
 	var str;
 	switch ( to_change )
 	{
 		case "company_name":
 			json = { "company_name" :what_change };
 			break;
 		case "company_site": 			
 			json = { "company_site" :what_change };
 			break;
 		case "co_email":
      console.log("message");
 			json = { "email" :what_change };
 			break;
 		case "co_phone": 			
 			json = { "phone" :what_change };
 			break;
  		case "skills_wanted":
 			json = { "skills_wanted" :what_change };
 			break;
 		case "company_departments": 			
 			json = { "company_departments" :what_change };
 			break;
 		case "company_industry":
 			json = { "company_industry" :what_change };
 			break;
 		case "min_years":
 			json = { "min_years" :what_change };
 			break;
 	}
 			
	$.post("/employer_profile/bullshit", json , doneFunc);

 }

function doneFunc()
{
	location.reload();
	console.log('done editing and reloading with no error checks');

}
