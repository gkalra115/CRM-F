'use strict';
var table;
var KTDatatablesExtensionButtons = (function () {
  var clientid = $(document).find('title').text();
  var initTable3 = function () {
    // begin first table

    var date = new Date();
    table = $('#kt_table_3').DataTable({
      dom: 'brltip',
      search: {
        regex: true,
      },
      order: [],
      select: true,
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
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
      order: [],
      ajax: {
        url: `/api/task/client/${clientid}?month=${
          date.getUTCMonth() + 1
        }&year=${date.getUTCFullYear()}`,
        type: 'GET',
        data: {
          // parameters for custom backend script demo
          columnsDef: [
            '_id',
            'title',
            'soft_deadline',
            'wordcount',
            'createdby',
            'status',
            'paymentstatus',
            'deleted',
            
          ],
        },
      },
      columns: [
        { data: '_id' },
        { data: 'title' },
        { data: 'soft_deadline' },
        { data: 'wordcount' },
        { data: 'budget' },
        { data: 'paid' },
        { data: 'paymentstatus' },
        { data: 'status' },
        
      ],
      columnDefs: [
        {
          targets: 0,
          render: function (data, type, full, meta) {
            return `<a href='/su/task/${data}' target="_blank" style="color:#000">${data}</a>`;
          },
        },
        {
          targets: 7,
          render: function (data, type, full, meta) {
            var taskstatus = {
              Unassigned: { title: 'Unassigned', color: 'rgba(219,9,9,0.6)' },
              Assigned: {
                title: 'Assigned',
                color: 'rgba(204,129,16,0.6)',
              },
              'Assigned to Admin': {
                title: 'Assigned to Admin',
                color: 'rgba(204,129,16,0.6)',
              },
              'Assigned to Manager': {
                title: 'Assigned to Manager',
                color: 'rgba(201,204,16,0.6)',
              },
              'Assigned to TeamLead': {
                title: 'Assigned to TeamLead',
                color: 'rgba(123,16,204,0.6)',
              },
              Running: { title: 'Running', color: 'rgba(3,156,6,0.6)' },
              'Quality Check': {
                title: 'Quality Check',
                color: 'rgba(66,79,67,0.6)',
              },
              Completed: { title: 'Completed', color: 'rgba(128,64,0,0.6)' },
              Delivered: { title: 'Delivered', color: 'rgba(16,85,145,0.6)' },
            };
            return (
              '<span class="kt-badge kt-badge--inline kt-badge--pill" style="background-color:' +
              taskstatus[data].color +
              '; color:#fff;">' +
              taskstatus[data].title +
              '</span>'
            );
          },
        },
        {
          targets: 6,
          render: function (data, type, full, meta) {
            var status = {
              'N/A': { title: 'N/A', state: 'dark' },
              Unpaid: { title: 'Unpaid', state: 'danger' },
              Paid: { title: 'Paid', state: 'success' },
              Partial: { title: 'Partial', state: 'warning' },
            };
            return (
              '<span class="kt-badge kt-badge--' +
              status[data].state +
              ' kt-badge--inline">' +
              status[data].title +
              '</span>'
            );
          },
        },
        {
          targets: 4,
          render: function (data, type, full, meta) {
            var status = {
              AUD: { title: '$' },
              CAD: { title: "$" },
              INR: { title: '₹' },
              GBP: { title: '£' },
              NZD: { title: '$' },
              USD: { title: '$' }
            };
            return full.currency ? status[full.currency].title + data : 'N/A';
          },
        },
        {
          targets: 5,
          render: function (data, type, full, meta) {
            var status = {
              AUD: { title: '$' },
              CAD: { title: "$" },
              INR: { title: '₹' },
              GBP: { title: '£' },
              NZD: { title: '$' },
              USD: { title: '$' }
            };
            return full.currency ? status[full.currency].title + data : 'N/A';
          },
        },
        {
          targets: 2,
          render: function (data, type, full, meta) {
            return `<span style="display:none;">${new Date(
              data
            ).getTime()}</span>${convertTableDate(data)}`;
          },
        },
      ],
    });

    $('#export_print').on('click', function (e) {
      e.preventDefault();
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
      var val = $.fn.dataTable.util.escapeRegex($(this).val());
      table
        .column(6)
        .search(val ? '^' + val + '$' : '', true, false)
        .draw();
    });

    $('#kt_form_status').selectpicker();
    $('.selectamount123').on('change', function () {
      var val = $.fn.dataTable.util.escapeRegex($(this).val());
      table
        .column(5)
        .search(val ? '^' + val + '$' : '', true, false)
        .draw();
    });

    $('.selectamount123').selectpicker();

    $('#generalSearch').keyup(function () {
      let myValue = $(this).val();
      table.search(myValue, true, false).draw();
    });

    $('#kt_datepicker').datepicker({
      todayHighlight: true,
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>',
      },
    });

    $('#kt_datatable_reload').on('click', function () {
      table.ajax.reload();
    });

    $('#tillEot').on('click', () => {
      clientfinancestats('EOT');
      $('#kt_dashboard_daterangepicker_date_3').text(`EOT`);
      table.ajax.url(`/api/task/client/${clientid}`).load();
    });

    $('#kt_dashboard_daterangepicker_3').on(
      'hide.daterangepicker',
      (ev, picker) => {
        const date = ev.format().split('-');
        table.ajax
          .url(`/api/task/client/${clientid}?month=${date[0]}&year=${date[1]}`)
          .load();
      }
    );

    $('#markPaymentComplete').click(function () {
      const taskData = table.rows('.selected').data();
      if (taskData.length === 0) {
        return toastr.warning('Please select task(s) to update payment(s)');
      }
      swal
        .fire({
          title: `Are you sure you wan to update ${taskData.length} task(s)?`,
          text: "You won't be able to revert this!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, update!',
          cancelButtonText: 'No, cancel!',
          reverseButtons: true,
        })
        .then(function (result) {
          if (result.value) {
            let taskId = [];
            for (let i = 0; i < taskData.length; i++) {
              taskId.push(taskData[i]._id);
            }
            $.ajax({
              method: 'PUT',
              url: '/api/payment/bulk',
              data: {
                taskId: JSON.stringify(taskId),
              },
              success: function (data) {
                if (data.redirect) {
                  return (window.location.href = data.redirect);
                }
                swal.fire('Updated!', 'Your tasks were updated.', 'success');
                table.ajax.reload();
                toastr.success(data.status);
              },
              error: function (error) {
                toastr.error(error.responseText);
              },
            });
          } else if (result.dismiss === 'cancel') {
            swal.fire(
              'Cancelled',
              'The Payment Update Job was cancelled',
              'error'
            );
          }
        });
    });
  };
  return {
    //main function to initiate the module
    init: function () {
      initTable3();
    },
  };
})();

const countSelect = () => {
  console.log($('#kt_table_3 tbody tr.selected').length, 'outside');
};

const convertTableDate = (date) => {
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let current_datetime = new Date(date);
  var formatted_date =
    current_datetime.getDate() +
    ' ' +
    months[current_datetime.getMonth()] +
    ' ' +
    current_datetime.getFullYear();
  return formatted_date;
};

jQuery(document).ready(function () {
  KTDatatablesExtensionButtons.init();
});
