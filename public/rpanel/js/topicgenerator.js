const titleextractor = () =>{
 var datainput = {
 topic : $("#topicenter").val()
 }
 $("button").addClass("kt-spinner");
 KTApp.blockPage({overlayColor: '#000000', state: 'primary', message: 'Processing...'});
 console.log(datainput)
 $.ajax({
    type: "POST",
    url: "/su/api/v1/aitools/topicgenerator",
    data: datainput,
    success: function (data) {
        $("#generatedcontent").empty().val('1. '+data.titles)
        $("button").removeClass("kt-spinner");
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


// countChar()
// function countChar(val) {
//     var text = document.getElementById("topicenter").value;
//     var numWords = 0;
//     for (var i = 0; i < text.length; i++) {
//         var currentCharacter = text[i];
//         if (currentCharacter == " ") {
//             numWords += 1;
//         }
//     }
//     numWords += 1;
//     $('#charNum').text(numWords+" words");
// }
// function auto_grow(element) {
//     element.style.height = "5px";
//     element.style.height = (element.scrollHeight)+"px";
// }