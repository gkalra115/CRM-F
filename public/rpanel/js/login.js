// $(".loginclick").click(function() {
//   var email = $("#email").val();
//   var password = $("#password").val();
//   $.ajax({
//         type: "POST",
//         url: "/login",
//         data: {
//           email: email,
//           password: password
//         },
//         success: function(data) {
//           console.log(data)
//         },
//         error: function(data) {
//           console.log(data)
//         }
//       });
// });
function myFunction() {
    var x = document.getElementById("password1");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  } 

