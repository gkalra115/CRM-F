$("#resultalert").hide();
  $('#submitaccountdetails').click(function () {
    var data = {
      publicholiday: $('.publicholidays').val(),
      wordcount: $('.wordcount').val()
    };
    KTApp.blockPage({
      overlayColor: '#000000',
      type: 'v2',
      state: 'primary',
      message: 'Processing...',
    });
    $.ajax({
      type: 'POST',
      url: '/expert/task/incalc',
      data: data,
      success: function (resdata) {
        $("#resultalert").show()
        KTApp.unblockPage();
        $("#incentive").text("You have earned "+resdata.incentive+" INR");
      },
    });
  });
