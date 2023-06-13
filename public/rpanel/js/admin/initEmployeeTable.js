'use strict';
var KTDatatablesExtensionButtons = (function () {
  var initTable3 = function () {
    // begin first table
    var table = $('#kt_table_3').DataTable({
      dom: 'brtip',
      // dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
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
        url: '/admin/employee/view',
        type: 'GET',
        data: {
          columnsDef: [
            'email',
            'name',
            'phone',
            'employee.user_role',
            'is_active',
          ],
        },
      },
      columns: [
        { data: 'email' },
        { data: 'name' },
        { data: 'phone' },
        { data: 'employee.user_role' },
        { data: 'is_active' },
      ],
      columnDefs: [
        {
          targets: 3,
          render: function (data, type, full, meta) {
            console.log(data);
            console.log(full);
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
        {
          targets: 4,
          render: function (data, type, full, meta) {
            var status = {
              1: { title: 'In-Active', state: 'danger' },
              2: { title: 'Active', state: 'success' },
            };
            if (data) {
              return (
                '<span class="kt-badge kt-badge--' +
                status[2].state +
                ' kt-badge--dot"></span>&nbsp;' +
                '<span class="kt-font-bold kt-font-' +
                status[2].state +
                '">' +
                status[2].title +
                '</span>'
              );
            }
            return (
              '<span class="kt-badge kt-badge--' +
              status[1].state +
              ' kt-badge--dot"></span>&nbsp;' +
              '<span class="kt-font-bold kt-font-' +
              status[1].state +
              '">' +
              status[1].title +
              '</span>'
            );
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
      table.columns(4).search($(this).val()).draw();
    });

    $('#kt_form_role').on('change', function () {
      table.columns(3).search($(this).val()).draw();
    });

    $('#kt_form_status,#kt_form_role').selectpicker();

    $('#generalSearch').keyup(function () {
      table.search($(this).val()).draw();
    });
    $('#kt_table_3 tbody').on('click', 'tr', function () {
      var data = table.row(this).data();
      var dataindex = table.row(this).index();
      toggleEmployeeCanvas(data._id, dataindex);
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
