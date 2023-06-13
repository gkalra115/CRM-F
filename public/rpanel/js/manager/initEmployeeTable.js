'use strict';
var KTDatatablesExtensionButtons = (function () {
  var initTable3 = function () {
    // begin first table
    var table = $('#kt_table_3').DataTable({
      dom: 'brtip',
      // dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      responsive: true,
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
        url: '/manager/employee/view',
        type: 'GET',
      },
      columns: [
        { data: 'email' },
        { data: 'name' },
        { data: 'phone' },
        { data: 'employee.user_role' },
      ],
      columnDefs: [
        {
          targets: 4,
          render: function (data, type, full, meta) {
            return `
              <div onclick='openSendMailDialog("${full.email}", "${full.name}")' class="mail" data-toggle="modal" data-target="#mailModal"><i class="flaticon2-mail"></i></div>
            `;
          },
        },
        {
          targets: 3,
          render: function (data, type, full, meta) {
            var additionalData = `<span id="userSalary" style="display:none">${full.employee.salary}</span><span style="display:none" id="userJoiningDate">${full.employee.joiningDate}</span>`;
            switch (data) {
              case 'SuperAdmin':
                return (
                  additionalData +
                  '<span id="user_role" class="kt-badge kt-badge--inline kt-badge--pill" style="background-color:#000; color:#fff;">' +
                  data +
                  '</span>'
                );
              case 'Admin':
                return (
                  additionalData +
                  '<span id="user_role" class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill">' +
                  data +
                  '</span>'
                );
              case 'Manager':
                return (
                  additionalData +
                  '<span id="user_role" class="kt-badge kt-badge--warning kt-badge--inline kt-badge--pill">' +
                  data +
                  '</span>'
                );
              case 'TeamLead':
                return (
                  additionalData +
                  '<span id="user_role" class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill">' +
                  data +
                  '</span>'
                );
              case 'Expert':
                return (
                  additionalData +
                  '<span id="user_role" class="kt-badge kt-badge--brand kt-badge--inline kt-badge--pill">' +
                  data +
                  '</span>'
                );
            }
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

    $('#kt_form_role').on('change', function () {
      table.columns(3).search($(this).val()).draw();
    });

    $('#kt_form_status,#kt_form_role').selectpicker();

    $('#generalSearch').keyup(function () {
      table.search($(this).val()).draw();
    });
  };

  return {
    //main function to initiate the module
    init: function () {
      initTable3();
    },
  };
})();

jQuery(document).ready(function () {
  KTDatatablesExtensionButtons.init();
});
