$.ajax({
  type: "GET",
  url: "/api/task/delayed?count=yes",
  success: function(data) {
    $("#delayedTaskCount").text(data.count);
  }
});
$.ajax({
  type: "GET",
  url: "/api/task/progress?count=yes",
  success: function(data) {
    $("#progressTaskCount").text(data.count);
  }
});
$.ajax({
  type: "GET",
  url: "/api/task/unassigned?count=yes",
  success: function(data) {
    $(".demo").hide("fast");
    $("#unassignedTaskCount").text(data.count);
    // ;
  }
});
var d = new Date();
var month = d.getMonth() + 1;
var year = d.getFullYear();

var currentDate = new Date();
var getMonthText = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];



function dashboardTopVendorSales(value) {
  var cMonth = value
    ? value === "EOT"
      ? "EOT"
      : value.split("-")[0]
    : currentDate.getMonth() + 1;
  var gMonth = value
    ? value === "EOT"
      ? "EOT"
      : value.split("-")[0] - 1
    : currentDate.getMonth();
  var cYear = value
    ? value === "EOT"
      ? "EOT"
      : value.split("-")[1]
    : currentDate.getFullYear();
  var apiUrl;
  if ((cMonth === "EOT", gMonth === "EOT", cYear === "EOT")) {
    apiUrl = "/admin/task/sales";
    $("#salesstats").text("Results till EOT");
  } else {
    apiUrl = `/admin/task/sales?month=${cMonth}&year=${cYear}`;
    $("#salesstats").text("Sales Stats of " + getMonthText[Number(gMonth)]);
  }
  $.ajax({
    type: "GET",
    url: apiUrl,
    success: function(data) {
      var totalWordCount = 0;
      var totalOrderTask = 0;
      var deliveredWordCount = 0;
      var deliveredTask = 0;
      data.forEach(function(obj) {
        totalWordCount += obj.wordcount;
        totalOrderTask += obj.totaltask;
        if (obj._id === "Delivered") {
          deliveredWordCount = obj.wordcount;
          deliveredTask = obj.totaltask;
        }
      });
      var pendingWordCount =
        totalWordCount - deliveredWordCount > 0
          ? totalWordCount - deliveredWordCount
          : 0;
      var pendingOrderTask =
        totalOrderTask - deliveredTask > 0 ? totalOrderTask - deliveredTask : 0;
      $(".demo1").hide("fast");
      $("#totalTask").text(totalOrderTask);
      $("#totalPendingTask").text(pendingOrderTask);
      $("#totalWordCount").text(totalWordCount);
      $("#pendingWordCount").text(pendingWordCount);
    },
    error: function(data) {
    }
  });
}


var daterangepickerInit = function() {
  var todayDate = new Date();
  var month = todayDate.getMonth() + 1;
  var year = todayDate.getFullYear();

  $("#kt_dashboard_daterangepicker_date_3").text(` ${month}-${year}`);
  $("#kt_dashboard_daterangepicker_3")
    .datepicker({
      direction: KTUtil.isRTL(),
      open: "right",
      orientation: "bottom right",
      format: "mm-yyyy",
      startView: "months",
      minViewMode: "months",
      autoclose: true
    })
    .on("changeDate", function(ev) {
      $("#kt_dashboard_daterangepicker_date_3").html(ev.format());
      var value = $("#kt_dashboard_daterangepicker_date_3").text();
      dashboardTopVendorSales(value);
    });
};

function tillEOT() {
  $("#kt_dashboard_daterangepicker_date_3").text(`EOT`);
  dashboardTopVendorSales("EOT");
}


$(document).ready(function() {
  dashboardTopVendorSales();

  daterangepickerInit();
  
});
