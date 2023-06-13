$.ajax({
  type: "GET",
  url: "/api/task/delayed?count=yes",
  success: function (data) {
    $("#delayedTaskCount").text(data.count);
  },
});
$.ajax({
  type: "GET",
  url: "/api/task/progress?count=yes",
  success: function (data) {
    $("#progressTaskCount").text(data.count);
  },
});
$.ajax({
  type: "GET",
  url: "/api/task/unassigned?count=yes",
  success: function (data) {
    $(".demo").hide("fast");
    $("#unassignedTaskCount").text(data.count);
    // ;
  },
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
  "December",
];

function dashboardTopVendor(value) {
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
    apiUrl = "/su/dashboardTopVendors";
    $("#topvendor").text("Results till EOT");
  } else {
    apiUrl = `/su/dashboardTopVendors?month=${cMonth}&year=${cYear}`;
    $("#topvendor").text("Top Vendors of " + getMonthText[Number(gMonth)]);
  }
  $.ajax({
    type: "GET",
    url: apiUrl,
    success: function (data) {
      console.log(data)
      var TopVendors = "";
      data.forEach(function (obj) {
        TopVendors += `<div class="kt-widget4__item"><span class="kt-badge kt-badge--username kt-badge--unified-success kt-badge--lg kt-badge--rounded kt-badge--bold" style="margin-right:10px;">${obj.clientName.charAt(
          0
        )}</span><div class="kt-widget4__info"><a class="kt-widget4__title" href="#"> ${
          obj.clientName
        } </a></div><span class="kt-widget4__ext"><span class="kt-widget4__number kt-font-danger">₹ ${
          obj.totalTransactionValue
        } </span></span></div>`;
      });
      $(
        ".kt-widget4__items.kt-widget4__items--bottom.kt-portlet__space-x.kt-margin-b-20"
      )
        .empty()
        .append(TopVendors);
    },
    error: function (data) {},
  });
}

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
    apiUrl = "/su/sales";
    $("#salesstats").text("Results till EOT");
  } else {
    apiUrl = `/su/sales?month=${cMonth}&year=${cYear}`;
    $("#salesstats").text("Sales Stats of " + getMonthText[Number(gMonth)]);
  }
  $.ajax({
    type: "GET",
    url: apiUrl,
    success: function (data) {
      var totalWordCount = 0;
      var totalOrderTask = 0;
      var deliveredWordCount = 0;
      var deliveredTask = 0;
      data.forEach(function (obj) {
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
    error: function (data) {},
  });
}

function dashboardTopVendorFinance(value) {
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
    apiUrl = "/su/finance";
    $("#FinanceSummary").text("Results till EOT");
  } else {
    apiUrl = `/su/finance?month=${cMonth}&year=${cYear}`;
    $("#FinanceSummary").text(
      "Finance Summary of " + getMonthText[Number(gMonth)]
    );
  }
  $.ajax({
    type: "GET",
    url: apiUrl,
    success: function (data) {
      $(".demo1").hide("fast");
      $("#turnover").text("₹ " + data.totalamount);
      $("#paid").text("₹ " + data.totalpaid);
      $("#pending").text("₹ " + data.totalpending);
    },
    error: function (data) {},
  });
}

var daterangepickerInit = function () {
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
      autoclose: true,
    })
    .on("changeDate", function (ev) {
      $("#kt_dashboard_daterangepicker_date_3").html(ev.format());
      var value = $("#kt_dashboard_daterangepicker_date_3").text();
      dashboardTopVendor(value);
      dashboardTopVendorSales(value);
      dashboardTopVendorFinance(value);
    });
};

function tillEOT() {
  $("#kt_dashboard_daterangepicker_date_3").text(`EOT`);
  dashboardTopVendor("EOT");
  dashboardTopVendorSales("EOT");
  dashboardTopVendorFinance("EOT");
}

var graphinitialize = function () {
  var datayear = {
    year: [],
    task: [],
  };
  $.ajax({
    type: "GET",
    url: "/apis/bulkdata/locus/data",
    success: function (data) {
      if (data.redirect) {
        return (window.location.href = data.redirect);
      }
      $(".demo3").hide();
      for (var i = 0; i < data.length; i++) {
        datayear.year.push(data[i]._id);
        datayear.task.push(data[i].totaktask);
      }
      var config = {
        type: "line",
        data: {
          labels: datayear.year,
          datasets: [
            {
              backgroundColor: "Red",
              data: datayear.task,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: "OZ Assignments task stats",
          },
          tooltips: {
            mode: "index",
            intersect: false,
          },
          hover: {
            mode: "nearest",
            intersect: true,
          },
          scales: {
            xAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "Year",
                },
              },
            ],
            yAxes: [
              {
                display: true,
                scaleLabel: {
                  display: true,
                  labelString: "Task",
                },
              },
            ],
          },
        },
      };
      var ctx = document.getElementById("canvas").getContext("2d");
      window.myLine = new Chart(ctx, config);
    },
  });
};

var KTCalendarBasic = (function () {

  //main function to initiate the module
  var calenderspi = function () {
      var todayDate = moment().startOf('day');
      var YM = todayDate.format('YYYY-MM');
      var YESTERDAY = todayDate.clone().subtract(1, 'day').format('YYYY-MM-DD');
      var TODAY = todayDate.format('YYYY-MM-DD');
      var TOMORROW = todayDate.clone().add(1, 'day').format('YYYY-MM-DD');

      var calendarEl = document.getElementById('kt_calendar');
      var calendar = new FullCalendar.Calendar(calendarEl, {
          plugins: [ 'interaction', 'dayGrid', 'timeGrid', 'list' ],

          isRTL: KTUtil.isRTL(),
          header: {
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },

          height: 800,
          contentHeight: 780,
          aspectRatio: 3,  // see: https://fullcalendar.io/docs/aspectRatio

          nowIndicator: true,
          now: TODAY + 'T09:25:00', // just for demo

          views: {
              dayGridMonth: { buttonText: 'month' },
              timeGridWeek: { buttonText: 'week' },
              timeGridDay: { buttonText: 'day' }
          },

          defaultView: 'dayGridMonth',
          defaultDate: TODAY,
          displayEventTime: false,
          editable: true,
          eventLimit: true, // allow "more" link when too many events
          navLinks: true,
          eventOrder: "key",
          events: '/api/task/calendar/getStats',
          eventRender: function(info) {
              var element = $(info.el);
              if (info.event.extendedProps && info.event.extendedProps.description) {
                  if (element.hasClass('fc-day-grid-event')) {
                      element.data('content', info.event.extendedProps.description);
                      element.data('placement', 'top');
                      KTApp.initPopover(element);
                  } else if (element.hasClass('fc-time-grid-event')) {
                      element.find('.fc-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>'); 
                  } else if (element.find('.fc-list-item-title').lenght !== 0) {
                      element.find('.fc-list-item-title').append('<div class="fc-description">' + info.event.extendedProps.description + '</div>'); 
                  }
              } 
          }
      });

      calendar.render();
  }
return {
//main function to initiate the module
init: function () {
  calenderspi();
},
};
})();


$(document).ready(function () {
  dashboardTopVendor();
  dashboardTopVendorSales();
  dashboardTopVendorFinance();
  daterangepickerInit();
  graphinitialize();
  KTCalendarBasic.init();
});

function createtaskextended() {
  $(location).attr("/su/createtask", url);
}