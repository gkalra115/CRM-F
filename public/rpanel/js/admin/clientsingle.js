var clientid = $(document)
  .find("title")
  .text();
$.ajax({
  type: "GET",
  url: "/api/client/" + clientid,
  success: function(data) {
    $("#whatsapp").on("click", function() {
      let taskurl = "https://api.whatsapp.com/send?phone=" + data.phone;
      window.open(taskurl, "_blank");
    });
    $("#clientinitials")
      .empty()
      .append(data.name.charAt(0));
    $("#clientname")
      .empty()
      .append(data.name);
    $("#clientemail")
      .empty()
      .html("<i class ='flaticon2-new-email'></i>" + data.email);
    $("#clientphone")
      .empty()
      .html("<i class ='flaticon2-phone'></i>" + data.phone);
    $("#clientuni")
      .empty()
      .html("<i class ='flaticon2-shelter'></i>" + data.client.university);
    $("#clientcountry")
      .empty()
      .html("<i class ='flaticon2-placeholder'></i>" + data.client.country);
    $("#clientportlet").show("slow");
    $("#errorclient").hide("fast");
  },
  error: function(jqXHR, exception) {
    console.log(jqXHR.responseText);
    $("#errorclient").show("slow");
    $("#clientportlet").hide("fast");
  }
});
var clientfinancestats = function(value) {
  var cMonth = value ? value === "EOT" ? "EOT" : value.split("-")[0] : currentDate.getMonth() + 1
  var gMonth = value ? value === "EOT" ? "EOT" : value.split("-")[0] - 1 : currentDate.getMonth()
  var cYear = value ? value === "EOT" ? "EOT" : value.split("-")[1] : currentDate.getFullYear()
  var apiUrl;
  if (cMonth === "EOT",gMonth === "EOT",cYear === "EOT") {
    apiUrl = `/api/client/finance/${clientid}`
  }else {
    apiUrl = `/api/client/finance/${clientid}?month=${cMonth}&year=${cYear}`
  }
  apiUrl = 
  $.ajax({
    type: "GET",
    url: apiUrl,
    success: function(data) {
      var datalength = data.length;
      var sum = 0;
      var count = 0;
      for (i = 0; i < datalength; i++) {
        sum += data[i].wordcount;
        count += data[i].totaltask;
        $("#currencyrevenue").empty().append(
          data[i]._id + " " + data[i].totalamount + " "
        );
        $("#currencypaid").empty().append(data[i]._id + " " + data[i].totalpaid + " "); 
      }
      $("#totalwordcount").empty().append(sum);
      $("#totaltasklen").empty().append(count);
    }
  });
};

$(document).ready(async function() {
  clientfinancestats("EOT");
  daterangepickerInit();
});
var daterangepickerInit = function() {
  var todayDate = new Date();
  var month = todayDate.getMonth() + 1;
  var year = todayDate.getFullYear();
  $("#kt_dashboard_daterangepicker_date_3").text(` ${month}-${year}`);
  $("#kt_dashboard_daterangepicker_3").datepicker({
    direction: KTUtil.isRTL(),
    open: "right",
    orientation: "bottom right",
    format: "mm-yyyy",
    startView: "months",
    minViewMode: "months",
    autoclose: true
  }).on("changeDate",function(ev){
    $("#kt_dashboard_daterangepicker_date_3").html(ev.format())
    var value = $("#kt_dashboard_daterangepicker_date_3").text()
    clientfinancestats(value)
  }) ;
};
