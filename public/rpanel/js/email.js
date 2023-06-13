const generateemail = () => {

    rawcontent = {
        content: $('#generatedmail').val()
    }

    KTApp.blockPage({overlayColor: '#000000', state: 'primary', message: 'Processing...'});
    $.ajax({
        type: "POST",
        url: "/api/v1/aitools/emailgenerator",
        data: rawcontent,
        success: function (data) {
            $('#finalemail').val(data.mail);
            $('#tokens').text(data.tokenlength);
            $('#costs').text(data.cost)
            const tokenconsumed = data.tokenlength
            KTApp.unblockPage();
            countChar()
        },
        error: function (jqXHR, exception) {
            KTApp.unblockPage();
            console.log(jqXHR)
        }
    })
}

const saveemail = () =>{
    rawcontent = {
        rawemail: $('#generatedmail').val(),
        finalemail: $('#finalemail').val(),
        token: $('#tokens').text()
    }
    console.log(rawcontent)
    KTApp.blockPage({overlayColor: '#000000', state: 'primary', message: 'Processing...'});
    $.ajax({
        type: "POST",
        url: "/su/api/v1/aitools/datasets/emaildata",
        data: rawcontent,
        success: function (data) {
            KTApp.unblockPage();
            toastr.success('Mail Saved');
        },
        error: function (jqXHR, exception) {
            KTApp.unblockPage();
            console.log(jqXHR)
        }
    })
}

$("#linkgmail").attr("href", "https://mail.google.com/mail/?view=cm&fs=1&su=SUBJECT&body="+$('#finalemail').val())
const copycontent = () => {

    var copyText = document.getElementById("finalemail");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);

    /* Alert the copied text */
    toastr.success('Copied');
}

const audiocontent = () => {
var className = $('#audiospeak').attr('class');
if(className == "btn btn-sm btn-outline-warning"){
$("#audiospeak").removeClass("btn-outline-warning");
$("#audiospeak").addClass("btn-warning");
$("#audoicon").removeClass("la-volume-up")
$("#audoicon").addClass("la-pause")
}
else {
    $("#audiospeak").removeClass("btn-warning");
$("#audiospeak").addClass("btn-outline-warning");
$("#audoicon").removeClass("la-pause")
$("#audoicon").addClass("la-volume-up")
}
}