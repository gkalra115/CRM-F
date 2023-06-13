const generatecontent = () => {

    topicdata = {
        content: $('#rawcontent').val()
    }

    KTApp.blockPage({overlayColor: '#000000', state: 'primary', message: 'Processing...'});
    $.ajax({
        type: "POST",
        url: "/su/list/paraphaser/content",
        data: topicdata,
        success: function (data) {
            $('#paraphasedcontent').val(data);
            KTApp.unblockPage();
        },
        error: function (jqXHR, exception) {
            KTApp.unblockPage();
            console.log("error")
        }
    })
}

const copycontent = () => {

    var copyText = document.getElementById("generatedcontent");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);

    /* Alert the copied text */
    toastr.success('Copied');
}

const generatedataset = () => {
    KTApp.blockPage({overlayColor: '#000000', state: 'primary', message: 'Processing...'});
    $.ajax({
        type: "GET",
        url: "/su/list/paraphaser/training",
        success: function (data) {
            KTApp.unblockPage();
            $('#promptenter').val(data.Original);
            $('#completenter').val(data.Paraphased);
        },
        error: function (jqXHR, exception) {
            KTApp.unblockPage();
            console.log("error")
        }
    })
}

const contenttopic = () => {
    KTApp.blockPage({overlayColor: '#000000', state: 'primary', message: 'Processing...'});
    topic = {
        "topic": $('#topicenter').val()
    }
    $.ajax({
        type: "POST",
        url: "/su/parphraser/api",
        data: topic,
        success: function (data) {
            KTApp.unblockPage();
            $('#generatedcontent').empty().val(data.generated);
            countChar();
        },
        error: function (jqXHR, exception) {
            KTApp.unblockPage();
            toastr.error('dataset Error');
            console.log("error");
        }
    })
}

const savedataset = () => {

    contentdata = {
        prompt: $('#promptenter').val(),
        completion: $('#completenter').val()
    }

    $.ajax({
        type: "POST",
        url: "/su/list/paraphaser/training",
        data: contentdata,
        success: function (data) {
            KTApp.unblockPage();
            toastr.success('dataset Added');
        },
        error: function (jqXHR, exception) {
            KTApp.unblockPage();
            toastr.error('dataset Error');
            console.log("error");
        }
    })
}
countChar()
function countChar(val) {
    var text = document.getElementById("generatedcontent").value;

    // Initialize the word counter
    var numWords = 0;

    // Loop through the text
    // and count spaces in it
    for (var i = 0; i < text.length; i++) {
        var currentCharacter = text[i];

        // Check if the character is a space
        if (currentCharacter == " ") {
            numWords += 1;
        }
    }

    // Add 1 to make the count equal to
    // the number of words
    // (count of words = count of spaces + 1)
    numWords += 1;
    $('#charNum').text(numWords+" words");
}
function auto_grow(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight)+"px";
}