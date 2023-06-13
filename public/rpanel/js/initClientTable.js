'use strict';

var KTDatatablesExtensionButtons = (function () {
  var initTable3 = function () {
    // begin first table
    var table = $('#kt_table_3').DataTable({
      dom: 'brltip',
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
        url: '/api/client/view',
        type: 'GET',
        data: {
          // parameters for custom backend script demo
          columnsDef: [
            '_id',
            'assignedTo.name',
            'name',
            'phone',
            'client.country',
            'client.university',
            'is_active',
          ],
        },
      },
      columns: [
        { data: '_id' },
        { data: 'assignedTo.name' },
        { data: 'name' },
        { data: 'phone' },
        { data: 'client.university' },
        { data: 'client.country' },
        { data: 'is_active' },
      ],
      columnDefs: [
        {
          targets: 6,
          render: function (data) {
            let rowData = {
              text: data ? 'Active' : 'In-Active',
              class1: data ? 'kt-badge--success' : 'kt-badge--danger',
              class2: data ? 'kt-font-success' : 'kt-font-danger',
            };
            return `<span class="kt-badge ${rowData.class1} kt-badge--dot"></span>&nbsp;<span class="kt-font-bold ${rowData.class2}">${rowData.text}</span>`;
          },
        },
        {
          targets: 1,
          render: function (data) {
            return `${data ? data : 'N/A'}`;
          },
        },
        {
          targets: 0,
          title: 'ID',
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
        .column(5)
        .search(val ? '^' + val + '$' : '', true, false)
        .draw();
    });

    $('#kt_datatable_reload').on('click', function () {
      table.ajax.reload();
    });

    $('#kt_form_status').selectpicker();

    $('#generalSearch').keyup(function () {
      table.search($(this).val()).draw();
    });

    //   $('#kt_table_3 tbody').on('click', 'tr', function () {
    //     var data = table.row( this ).data();
    //     toggleClientCanvas(data)
    // } );
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
