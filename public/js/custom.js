$("select#freelance-quote-industry").change(function(){
        var selectedV = $(this).children("option:selected").val();
		if(selectedV == "email")
		{
			$('#freelance-quote-industry1').empty();
			$('#freelance-quote-industry1').append(`<option value="null" selected>-- Select One --</option>`);
			$('#freelance-quote-industry1').append(`<option value="emailtoboss">Write an email to boss for leave due to ill health.</option>`);
			$('#freelance-quote-industry1').append(`<option value="emailtoemployee">Write an email to employee for termination as he have breached company policies.</option>`);
			$('#freelance-quote-industry1').append(`<option value="emailtofriend">Write an email to friend for inviting him to your marriage.</option>`);
			$('#freelance-quote-industry1').append(`<option value="emailtoemployee">Write an email to teacher for wishing on teachers day.</option>`);
								  
		}
		else if(selectedV == "quizsolver")
		{
			$('#freelance-quote-industry1').empty();
			$('#freelance-quote-industry1').append(`<option value="null" selected>-- Select One --</option>`);
			$('#freelance-quote-industry1').append(`<option value="quiz">Quiz</option>`);
			$('#freelance-quote-industry1').append(`<option value="shortanswers">ShortAnswers</option>`);
								  
		}
		else
		{
			$('#freelance-quote-industry1').empty();
			$('#freelance-quote-industry1').append(`<option value="null" selected>-- Select One --</option>`);
		}
});

$("select#freelance-quote-industry1").change(function(){
	var selectedV = $(this).children("option:selected").text();
	if(selectedV == "Quiz"){
			$('#event-registration-bio').val("Former Australian captain Mark Taylor has had several nicknames over his playing career. Which of the following was NOT one of them?\nA. Tubby\nB. Stodge\nC. Helium Bat\nD. Stumpy"); 
	}
	else if(selectedV == "ShortAnswers"){
			$('#event-registration-bio').val("What is difference between mass and weight?"); 
	}
	else{
		$('#event-registration-bio').val(selectedV); 
	}
	
})

function openSolution(){
	var valueapp = $('#freelance-quote-industry').val();
	var valueexemplar = $('#freelance-quote-industry1').val();
	if(valueapp == "quizsolver"){
		if(valueexemplar == "quiz" || valueexemplar == "shortanswers"){
			$(".loader").show()
			var rawcontent = {
				question:$('#event-registration-bio').val(),
			}		
			$.ajax({
				type: "POST",
				url: "/api/v1/aitools/quizanswer",
				data: rawcontent,
				success: function (data) {
					$('#event-registration-bio').val(data.qanswer);
					$(".loader").hide()
					$("#errortool").empty().hide();
					$("#errorexemplar").empty().hide();
				},
				error: function (jqXHR, exception) {
					//$(".loader").hide()
				}
			})
		}
		else{
			$("#errorexemplar").text("Please select exemplar you want to use");
			$("#errorexemplar").show();
		}
	
	}
	else if(valueapp == "email"){
		$(".loader").show()
	var rawcontent = {
		content:$('#event-registration-bio').val(),
	}		
	$.ajax({
        type: "POST",
        url: "/api/v1/aitools/open/emailgenerator",
        data: rawcontent,
        success: function (data) {
            $('#event-registration-bio').val(data.mail);
            $(".loader").hide();
        },
        error: function (jqXHR, exception) {
            console.log(jqXHR)
        }
    })
	}
	else{

		$("#errortool").text("Please select Tool you want to use");
		$("#errortool").show();
	}
	
}

function validateForm() {
	let name = $("#block-contactform-name").val();
	let email = $("#block-contactform-email").val();
	let number = $("#block-contactform-number").val();
	let category = $("#template-contactform-subject").val();
	if (name == "") {
		$('#block-contactform-name').attr('style', "border-radius: 5px; border:#FF0000 1px solid;");
	  return false;
	}
  } 
function sendMessage(){	
	$(".loader1").show()
	var rawcontent = {
		name : $("#block-contactform-name").val(),
		email : $("#block-contactform-email").val(),
		number : $("#block-contactform-number").val(),
		category : $("#template-contactform-subject").val()
	}
	console.log(rawcontent)
	$.ajax({
        type: "POST",
        url: "/api/v1/aitools/query",
        data: rawcontent,
        success: function (data) {
            $(".loader1").hide();
			$("#beforeformsubmit").hide();
			$("#afterformsubmit").show();
        },
        error: function (jqXHR, exception) {
            //$(".loader").hide()
        }
    })
}
