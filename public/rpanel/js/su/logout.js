$(document).ready(async function() {
  $("#kt_login_signin_submit").click(function() {
    KTApp.blockPage({
      overlayColor: '#000000',
      type: 'v2',
      state: 'primary',
      message: 'Loggin Out...'
  });
  $.ajax({
    type: "POST",
    url: "/logout",
    
    success: function(data) {
      setTimeout(function() {
        KTApp.unblockPage();
        window.location.replace(data);
    }, 2000);
    },
    error: function(data) {
      console.log(data)
    }
  });
  
  });
});
