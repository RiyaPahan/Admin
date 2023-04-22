$(document).ready(function(){
   
    $.validator.addMethod(
        "regex",
        function(value, element, regexp) 
        {
            if (regexp.constructor != RegExp)
                regexp = new RegExp(regexp);
            else if (regexp.global)
                regexp.lastIndex = 0;
            return this.optional(element) || regexp.test(value);
        },
        "Please check your input."
);

//  $.validator.addMethod(
//    "minage",
//    function (value, element, min) {
//      var today = new Date();
//      var birthDate = new Date(value);
//      var age = today.getFullYear() - birthDate.getFullYear();

//      if (age > min + 1) {
//        return true;
//      }

//      var m = today.getMonth() - birthDate.getMonth();

//      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//        age--;
//      }

//      return age >= min;
//    },
//    "You are not too old !"
//  );



$(document).ready(function(){


	var $regexname = /^[a-zA-Z]*$/;
	
  //firstname

    $('#first_name').on('keypress keydown keyup',function(){

		var fname = $('#first_name').val();

		if(fname.length > 0) {
		 	
			if (!$(this).val().match($regexname)) {
              // there is a mismatch, hence show the error message
                 $('#errfname').removeClass('hidden');
                 $('#errfname').text('Please enter valid name');
		
             }
         		 else{
               
                $('#errfname').addClass('hidden');

               }	
		 }
               	
             
         });

	//last name
	
	$('#last_name').on('keypress keydown keyup',function(){

	var lname = $('#last_name').val();

		if(lname.length > 0) {


			if (!$(this).val().match($regexname)) {

        $('#errlname').removeClass('hidden');
		 $('#errlname').text('please enter valid name');

	 }
		  else{
		
		$('#errlname').addClass('hidden');

	   }		

		}
	   	 
 });

});



$("#create").validate({
rules: {
first_name: {
  required: true,
  //regex:/^[a-zA-Z]*$/,
  minlength: 3
},
last_name:{

  required: true,
 // regex:/^[a-zA-Z]*$/,
  minlength: 3
},
email:{

  required: true,
  regex: /^[A-Za-z0-9_]+\@[A-Za-z0-9_]+\.[A-Za-z0-9_]+/
},
profile:{

  required: true,
  regex:/\.(jfif|jpe?g|tiff?|png|webp|bmp|jfif)$/i
},
phone:{

  required:true,
  regex: /^[ ()+]*([0-9][ ()+]*){10}$/,  
},
dob:{

  required: true,
 // minage: 18
},
role:{

    required:true
}
},
messages: {
first_name: {
  required: "First name should not be empty",
  //regex: "Please Enter valid First Name,only alphabate [A-Z]   ",
  minlength:"minimum 3 character require"
},
last_name: {
  required: "Last name should not be empty",
 // regex: "Please Enter valid Last Name,only alphabate [A-Z] ",
  minlength:"minimum 3 character required"
},
email:{

  required: "Email should not be empty",
  regex: 'Please enter a valid email, example@gmail.com'
},
profile:{

  required:"Profile picture must be required",
  regex:"Profile picture jpeg,jpg,png,jfif are support only "
},
phone:{

  required:"Phone number must be required",
  regex: "Phone number must be 10 digit & only 0-9" 
},
dob:{

    required:"DOB must be required",
    dob: true
  },
role:{

    required:"Please choose a role "
}
}
  });

  $('#dob').datepicker({
    dateFormat:'dd-mm-yy',
    changeMonth: true,
    changeYear: true,
    yearRange:"1930:2050",
    maxDate:'-18y',
})

});























