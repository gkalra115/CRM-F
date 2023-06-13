const answerquestion = () => {

    rawcontent = {
        question: $('#generatedquestion').val()
    }
    console.log(rawcontent)
    KTApp.blockPage({overlayColor: '#000000', state: 'primary', message: 'Processing...'});
    $.ajax({
        type: "POST",
        url: "/api/v1/aitools/quizanswer",
        data: rawcontent,
        success: function (data) {
            console.log(data)
            $('#answerquiz').empty().text(data.qanswer);
            KTApp.unblockPage();
        },
        error: function (jqXHR, exception) {
            KTApp.unblockPage();
            console.log("error")
        }
    })
}
