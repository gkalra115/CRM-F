"use strict";
var KTDatatablesExtensionButtons = (function() {
  var initTable3 = function() {
    // begin first table
    var table = $("#kt_table_3").DataTable({
      dom: "brtip",
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      responsive: true,
      buttons: [
        {
          extend: "print",
          exportOptions: {
            columns: "th:not(:last-child)"
          }
        },
        {
          extend: "copyHtml5",
          exportOptions: {
            columns: "th:not(:last-child)"
          }
        },
        {
          extend: "excelHtml5",
          exportOptions: {
            columns: "th:not(:last-child)"
          }
        },
        {
          extend: "csvHtml5",
          exportOptions: {
            columns: "th:not(:last-child)"
          }
        },
        {
          extend: "pdfHtml5",
          exportOptions: {
            columns: "th:not(:last-child)"
          }
        }
      ],
      processing: true,
      searchDelay: 500,
      ajax: {
        url: "/expert/task/all",
        type: "GET",
        data: {
          // parameters for custom backend script demo
          columnsDef: [
            "_id",
            "title",
            "deadline",
            "status",
            "wordcount",
            "teamlead.name"
          ]
        }
      },
      columns: [
        { data: "_id" },
        { data: "title" },
        { data: "deadline" },
        { data: "status" },
        { data: "wordcount" },
        { data: "teamlead.name" }
      ],
      columnDefs: [
        {
          targets: 0,
          render: function(data, type, full, meta){
            return (`<a href="/ex/view/${data}" style="color:#000">${data}</a>`)
          }
      },
        {
          targets: 3,
          render: function(data, type, full, meta){
            var taskstatus = {
              Unassigned: { title: "Unassigned", color: "rgba(219,9,9,0.8)" },
              "Assigned to Admin": {
                title: "Assigned to Admin",
                color: "rgba(204,129,16,0.8)"
              },
              "Assigned to Manager": {
                title: "Assigned to Manager",
                color: "rgba(201,204,16,0.8)"
              },
              "Assigned to TeamLead": {
                title: "Assigned to TeamLead",
                color: "rgba(123,16,204,0.8)"
              },
              Running: { title: "Running", color: "rgba(3,156,6,0.8)" },
              "Quality Check": { title: "Quality Check", color: "rgba(66,79,67,0.8)" },
              Completed: { title: "Completed", color: "rgba(128,64,0,0.8)" },
              Delivered: { title: "Delivered", color: "rgba(16,85,145,0.8)" }
            };
            return (
              '<span class="kt-badge kt-badge--inline kt-badge--pill" style="background-color:'+ taskstatus[data].color+'; color:#fff;">'+taskstatus[data].title+'</span>'
            );
          }
        },
        {
          targets: 2,
          render: function(data, type, full, meta) {
            return convertTableDate(data);
          }
        },
        {
          targets: 5,
          render: function(data, type, full, meta){
            if(data == undefined){
              return (
                ` <span style="width: 110px;"><span class="kt-font-bold kt-font-danger">N/A</span></span>`
               );
            }
            else{
              return (
                ` <span style="width: 110px;"><span class="kt-font-bold kt-font-success">${data}</span></span>`
               );
            }
          }
        }
      ]
    });

    $("#export_print").on("click", function(e) {
      e.preventDefault();
      table.button(0).trigger();
    });

    $("#export_copy").on("click", function(e) {
      e.preventDefault();
      table.button(1).trigger();
    });

    $("#export_excel").on("click", function(e) {
      e.preventDefault();
      table.button(2).trigger();
    });

    $("#export_csv").on("click", function(e) {
      e.preventDefault();
      table.button(3).trigger();
    });

    $("#export_pdf").on("click", function(e) {
      e.preventDefault();
      table.button(4).trigger();
    });

    $("#kt_form_status").on("change", function() {
      console.log($(this).val());
      table
        .columns(5)
        .search($(this).val())
        .draw();
    });

    $("#kt_form_status").selectpicker();

    $("#generalSearch").keyup(function() {
      table.search($(this).val()).draw();
    });
  };
  return {
    //main function to initiate the module
    init: function() {
      initTable3();
    }
  };
})();

jQuery(document).ready(function() {
  KTDatatablesExtensionButtons.init();
  $.ajax({
    type: "GET",
    url: "/expert/task/delayed?count=yes",
    success: function(data) {
      $(".demo").hide("fast");
      $("#delayedTaskCount").text(data.count);
      // ;
    }
  });
  $.ajax({
    type: "GET",
    url: "/expert/task/all?count=yes",
    success: function(data) {
      $(".demo").hide("fast");
      $("#totaltask").text(data.count);
      // ;
    }
  });
  $.ajax({
    type: "GET",
    url: "/expert/task/current?count=yes",
    success: function(data) {
      $(".demo").hide("fast");
      $("#currenttask").text(data.count);
      // ;
    }
  });
});
const convertTableDate = date => {
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  let current_datetime = new Date(date);
  var formatted_date =
    current_datetime.getDate() +
    " " +
    months[current_datetime.getMonth()] +
    " " +
    current_datetime.getFullYear();
  return formatted_date;
};