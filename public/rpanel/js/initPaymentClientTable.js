"use strict";
var KTDatatablesExtensionButtons = (function() {
  var initTable3 = function() {
    // begin first table
    var table = $("#kt_table_3").DataTable({
      dom: "brltip",
      // dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
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
        url: "/su/payment/bda/",
        type: "GET",
        data: {
          columnsDef: ["_id", "BDA.name", "clientname", "budget", "paid", "title"]
        }
      },
      columns: [
        { data: "_id" },
        { data: "BDA.name" },
        { data: "clientname" },
        { data: "budget" },
        { data: "paid" },
        { data: "title"}
      ],
      columnDefs: [
        {
          targets: 3,
          render: function(data, type, full, meta) {
            
            if(data == undefined){
              return '--'
            }
            else{
              return data+" "+full.currency;
            }
            
          }
        },
        {
          targets: 1,
          render: function(data, type, full, meta) {
            return data+'&nbsp;&nbsp;<span id="user_role" class="kt-badge kt-badge--inline kt-badge--inline kt-badge--pill" style="background-color:#3cd; color:#fff;">BDM</span>'
          }
        },
        {
          targets: 5,
          render: function(data, type, full, meta) {
            if(full.currency == 'AUD'){
              return full.budget*52;
            }
            else if(full.currency == 'CAD'){
              return full.budget*58;
            }
            else if(full.currency == 'GBP'){
              return full.budget*85;
            }
            else if(full.currency == 'USD'){
              return full.budget*75;
            }
            else{
              return "--"
            }
          }
        },
        {
          targets: 4,
          render: function(data, type, full, meta) {
            
            if(data == undefined){
              return '--'
            }
            else{
              return data+" "+full.currency;
            }
            
          }
        },
        {
          targets: 0,
          render: function(data, type, full, meta) {
            return `<a href="/su/task/${full._id}" target="_blank" style="cursor:pointer;"><span class="btn btn-label-info btn-sm btn-bold btn-upper" style="cursor:pointer;" id="taskModified">${full._id}</span></a>`
          }
        }
      ],
      // footerCallback: function (row, data, start, end, display) {
      //   var api = this.api(),
      //       data;
      //   var total = api
      //   .column(2)
      //   .data()
      //   .reduce(function(a, b) {
      //       return a + b;
      //   }, 0);
      //   // Total over this page
      //   var pageTotal = api
      //       .column(2, {
      //           page: "current"
      //       })
      //       .data()
      //       .reduce(function(a, b) {
      //           return a + b;
      //       }, 0);
      //       $(api.column(3).footer()).html(
      //          pageTotal + " ( " + total + " total)"
      //     );
        
      // }
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
      table
        .columns(4)
        .search($(this).val())
        .draw();
    });

    $("#kt_form_role").on("change", function() {
      table
        .columns(3)
        .search($(this).val())
        .draw();
    });

    $('#kt_datatable_reload').on('click', function() {
			table.ajax.reload();
		});

    $("#kt_form_status,#kt_form_role").selectpicker();
    $("#generatereports").click(function() {
      KTApp.blockPage({
        overlayColor: '#000000',
        state: 'primary',
        message: 'Processing...'
       });
      $.ajax({
        type: "GET",
        url: "/su/payment/bda/?month="+$("#entermonth").val()+"&year="+$("#enteryear").val()+"&bda="+$("#selectbda").val(),
        success: function(data){
          $("#paymentable").show();  
          table.ajax.url("/su/payment/bda/?month="+$("#entermonth").val()+"&year="+$("#enteryear").val()+"&bda="+$("#selectbda").val()).load();      
            KTApp.unblockPage();
            
        },
        error: function(jqXHR, exception) {
            KTApp.unblockPage();
           
          }
        })
    })
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
  //   $('#kt_table_3_filter').prepend(`<label style = "
  //   margin-right: 1rem;
  //   ">Status:
  //   <select class="form-control form-control-md"
  //     style="
  //     margin-left: 0.5em;
  //     display: inline-block;
  //     width: auto;
  //     "
  //     id="kt_form_role">
  //     <option value="">All</option>
  //     <option value="1">Pending</option>
  //     <option value="2">Delivered</option>
  //     <option value="3">Canceled</option>
  //     <option value="4">Success</option>
  //     <option value="5">Info</option>
  //     <option value="6">Danger</option>
  //   </select>
  //   </label>
  //   <label style = "
  //   margin-right: 1rem;
  //   ">Status:
  //   <select class="form-control form-control-md"
  //     style="
  //     margin-left: 0.5em;
  //     display: inline-block;
  //     width: auto;
  //     "
  //     id="kt_form_status">
  //     <option value="">All</option>
  //     <option value="1">Pending</option>
  //     <option value="2">Delivered</option>
  //     <option value="3">Canceled</option>
  //     <option value="4">Success</option>
  //     <option value="5">Info</option>
  //     <option value="6">Danger</option>
  //   </select>
  //   </label>`)
});
