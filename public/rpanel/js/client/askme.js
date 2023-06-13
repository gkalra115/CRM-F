
function answerquestion() {
        rawcontent = {
            question: $('#createcontent').val()
        }
        $(".loader1").show();
        var value = rawcontent.question;
        if(value == ""){
            $(".loader1").hide();
            iziToast.error({
                title: 'Error',
                message: "Oh snap! Enter anything to ask",
            });
        }
        else{
            $("#tabs-291").empty();
            $.ajax({
                url: '/api/v1/aitools/quizanswer',
                method: 'POST',
                data: rawcontent,
                success: function (data) {
                    $(".loader1").hide();
                    $("#tabs-291").empty().text(data.qanswer);
                    iziToast.success({
                        title: 'OK',
                        message: 'You have consumed '+data.tokenlength+" tokens."
                    });
                    
                    // $("#msgtok").empty().text("You have consumed "+data.tokenlength+" tokens")
                    // $("#tokenmsg").show();
                    // $("#tokenmsg").fadeOut(1500,"linear");
                },
                error: function (error) {
                    $(".loader1").hide();
                    iziToast.error({
                        title: 'Error',
                        message: error.responseText,
                    });
                },
              });
        }     
};