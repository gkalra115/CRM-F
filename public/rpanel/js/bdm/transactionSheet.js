'use strict';
var KTDatatablesExtensionButtons = (function () {
  var now = new Date();
  var currentMonth = now.getMonth() + 1;
  var currentYear = now.getFullYear();
  var currentMonthprint = new Date().toLocaleString('default', { month: 'long' });
  $('#monthselected').text(currentMonthprint)
  var initTable3 = function () {
    // begin first table
    var table = $('#kt_table_3').DataTable({
      dom: 'brtip',
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      responsive: true,
      createdRow: function (row, data, dataIndex) {
        $(row).css('cursor', 'cell');
      },
      buttons: [
        {
          extend: 'print',
          exportOptions: {
            columns: 'th:not(:last-child)',
          },
        },
        {
          extend: 'copyHtml5',
          exportOptions: {
            columns: 'th:not(:last-child)',
          },
        },
        {
          extend: 'excelHtml5',
          exportOptions: {
            columns: 'th:not(:last-child)',
          },
        },
        {
          extend: 'csvHtml5',
          exportOptions: {
            columns: 'th:not(:last-child)',
          },
        },
        {
          extend: 'pdfHtml5',
          exportOptions: {
            columns: 'th:not(:last-child)',
          },
        },
      ],
      processing: true,
      searchDelay: 500,
      ajax: {
        url: `/bdm/task/transaction?month=${currentMonth}&year=${currentYear}`,
        type: 'GET',
        data: {
          // parameters for custom backend script demo
          columnsDef: [
            'clientId.name',
            'transactionValue',
            'receivedOn',
            'paymentAccount',
            'verified',
          ],
        },
      },
      columns: [
        { data: 'clientId.name' },
        { data: 'transactionValue' },
        { data: 'receivedOn' },
        { data: 'paymentAccount' },
        { data: 'verified' }
      ],
      columnDefs: [
        {
          targets: 4,
          render: function (data) {
            let rowData = {
              text: data ? 'Verified' : 'Not-Verified',
              class1: data ? 'kt-badge--success' : 'kt-badge--danger',
              class2: data ? 'kt-font-success' : 'kt-font-danger',
            };
            return `<span class="kt-badge ${rowData.class1} kt-badge--dot"></span>&nbsp;<span class="kt-font-bold ${rowData.class2}">${rowData.text}</span>`;
          },
        },
        {
          targets: 1,
          render: function (data, type, full, meta) {
            var amount = data + " " + full.transactionCurrency;
            return `${amount}`;
          },
        },
        {
          targets: 2,
          render: function (data, type, full, meta) {
            return `${formatDate(data)}`
          }
        }
      ],
    });

    $('#export_print').on('click', function (e) {
      e.preventDefault();
      console.log("print")
      table.button(0).trigger();
    });

    $('#export_copy').on('click', function (e) {
      e.preventDefault();
      table.button(1).trigger();
    });

    $('#export_excel').on('click', function (e) {
      e.preventDefault();
      table.button(2).trigger();
    });

    $('#export_csv').on('click', function (e) {
      e.preventDefault();
      table.button(3).trigger();
    });

    $('#export_pdf').on('click', function (e) {
      e.preventDefault();
      table.button(4).trigger();
    });

    $('#kt_form_status').on('change', function () {
      table.columns(5).search($(this).val()).draw();
    });

    $('#kt_form_status').selectpicker();

    $('#generalSearch').keyup(function () {
      table.search($(this).val()).draw();
    });
    //   $('#kt_table_3 tbody').on('click', 'tr', function () {
    //     var data = table.row( this ).data();
    //     toggleClientCanvas(data)
    // } );
    $('#kt_dashboard_daterangepicker_3').on(
      'hide.daterangepicker',
      (ev, picker) => {
        const date = ev.format().split('-');
        table.ajax
          .url(`/bdm/task/transaction?month=${date[0]}&year=${date[1]}`)
          .load();
          statsdata(`/bdm/task/transaction/stats?month=${date[0]}&year=${date[1]}`)
      }
    );

    $('#kt_datepicker').datepicker({
      todayHighlight: true,
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>',
      },
    });
    $('#tillEot').on('click', () => {
      $('#kt_dashboard_daterangepicker_date_3').text(`EOT`);
      table.ajax.url(`/bdm/task/transaction`).load();
      statsdata(`/bdm/task/transaction/stats`)
    });
  };
  return {
    //main function to initiate the module
    init: function () {
      initTable3();
      statsdata(`/bdm/task/transaction/stats?month=${currentMonth}&year=${currentYear}`)
    },
  };
})();

jQuery(document).ready(function () {
  KTDatatablesExtensionButtons.init();
  daterangepickerInit();
  selectclientsInit();

  
  $('#actionButton').on('click', function() {
    createtrancationvalidation();
    if ($('#createTransactionsheet1').valid()) {
      createEffort();
    }
  });
  // $('#tillEot').on('click', () => {
  //   //clientfinancestats('EOT');
  //   console.log("cliekd")
  //   $('#kt_dashboard_daterangepicker_date_3').text(`EOT`);

  //   //table.ajax.url(`/api/task/client/${clientid}`).load();
  // });
  
  


});

var createtrancationvalidation = function () {
var form = $('#createTransactionsheet1');
  form.validate({
    rules: {
      client: {
        required: true,
      },
      amount: {
        required: true,
        number: true
      },
      currency: {
        required: true
      },
      tdate: {
        required: true,
        date: true
      },
      payaccount: {
        required: true,
      }
    },
    messages: {
      client: {
        required: "Please select a client."
      },
      amount: {
        required: "Please enter the amount.",
        number: "Please enter a valid number."
      },
      currency: {
        required: "Please select a currency."
      },
      tdate: {
        required: "Please enter the transaction date.",
        date: "Please enter a valid date."
      },
      payaccount: {
        required: "Please select a payment account."
      }
    }
  });
}


function createEffort() {
  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
  };
  // Gather data from the form fields
  const client = $('#selectclient').val();
  const amount = $('#amount').val();
  const currency = $('#selectcurrency').val();
  const transactionDate = $('#transactionDate').val();
  const paymentAccount = $('#paymentAmount').val();
  KTApp.block('#kt_modal_4', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });

  // Send a request to the server-side endpoint
  $.ajax({
    type: 'POST',
    url: '/bdm/task/transaction',
    data: {
      client,
      amount,
      currency,
      transactionDate,
      paymentAccount
    },
    success: function (response) {
      // Handle success response from the server
      KTApp.unblock('#kt_modal_4');
      $('#createTransactionsheet1').trigger("reset");
      $('#kt_modal_4').modal('toggle');
      toastr.success('New transaction Added');
      if ($.fn.DataTable.isDataTable('#kt_table_3')) {
        $('#kt_table_3').DataTable().destroy();
      }
      $('#kt_table_3 tbody').empty();
      KTDatatablesExtensionButtons.init();
    },
    error: function (error) {
      KTApp.unblock('#kt_modal_4');
      $('#kt_modal_4').modal('toggle');
      toastr.error(jqXHR.responseText);
    }
  });
}
const clearForm = () => {
  var form = $('#createTransactionsheet1');
  form.resetForm();
};


function formatDate(dateString) {
  var date = new Date(dateString);
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthName = months[monthIndex];
  return day + ' ' + monthName + ' ' + year;
}

function statsdata(api) {
  $.ajax({
    type: 'GET',
    url: api,
    success: function (response) {
      const totalAmount = response.data.totalAmount;
      const totalTransactions = response.data.totalTransactions;
      const amountValue = document.querySelector('.kt-widget__value1 span:first-of-type');
      const transValue = document.querySelector('.kt-widget__value2 span:last-of-type');
      
      // update amount received
      let amountHtml = '';
      for (let [currency, value] of Object.entries(totalAmount)) {
        amountHtml += `${value.toFixed(2)} ${currency} `;
      }
      amountValue.innerHTML = amountHtml;
      
      // update total transactions
      let transHtml = '';
      for (let [currency, value] of Object.entries(totalTransactions)) {
        transHtml += `(${value}) ${currency} `;
      }
      transValue.innerHTML = transHtml;
      
      
    }
  })
}

var selectclientsInit = function () {
  $.ajax({
    url: '/bdm/client/view',
    dataType: 'json',
    success: function(data) {
        $.each(data, function(key, value) {
          $.map(data.data, function (item) {
            $('#selectclient').append('<option value="' + item._id + '">' + item.name + '</option>');
          })
            
        });
    }
});
}

var daterangepickerInit = function () {

  var todayDate = new Date();
  var month = todayDate.getMonth() + 1;
  var year = todayDate.getFullYear();
  $('#kt_dashboard_daterangepicker_date_3').empty().text(` ${month}-${year}`);
  $('#kt_dashboard_daterangepicker_3')
    .datepicker({
      direction: KTUtil.isRTL(),
      open: 'right',
      orientation: 'bottom right',
      format: 'mm-yyyy',
      startView: 'months',
      minViewMode: 'months',
      autoclose: true,
    })
    .on('changeDate', function (ev) {
      $('#kt_dashboard_daterangepicker_date_3').html(ev.format());
      var value = $('#kt_dashboard_daterangepicker_date_3').text();
    });
};