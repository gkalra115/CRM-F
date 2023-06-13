const copycontent = () => {

    var copyText = $("#answerquiz").text();
    navigator.clipboard.writeText(copyText.value);

    /* Alert the copied text */
    toastr.success('Copied');
}

const answerquestion = () => {

    rawcontent = {
        question: $('#generatedquestion').val()
    }
    KTApp.blockPage({overlayColor: '#000000', state: 'primary', message: 'Processing...'});
    $.ajax({
        type: "POST",
        url: "/api/v1/aitools/quizanswer",
        data: rawcontent,
        success: function (data) {
            toastr.success(data.tokenlength+" Tokens consumed.");
            $('#answerquiz').empty().text(data.qanswer);
            KTApp.unblockPage();
            tokencount()
        },
        error: function (jqXHR, exception) {
            KTApp.unblockPage();
            toastr.error(jqXHR.responseText)
        }
    })
}

const tokencount = () => {
    $.ajax({
        type: "GET",
        url: "/api/v1/aitools/tokens",
        success: function (data) {
            $("#tokenalert").show();
            $('#tokencount').empty().html("Total tokens remaining: <strong>"+data.tokenlength[0].updatedtokens+"</strong>");
            
        },
        error: function (jqXHR, exception) {
            KTApp.unblockPage();
            toastr.error(jqXHR.responseText)
        }
    })
}
$(function() {
    tokencount();
});