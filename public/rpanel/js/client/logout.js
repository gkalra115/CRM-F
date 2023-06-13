$(document).ready(async function() {
  $("#kt_login_signin_submit").click(function() {
    $(".loader1").show();
  $.ajax({
    type: "POST",
    url: "/logout",
    
    success: function(data) {
      setTimeout(function() {
        $(".loader1").hide();
        window.location.replace(data);
    }, 2000);
    },
    error: function(data) {
      console.log(data)
    }
  });
  
  });
});
