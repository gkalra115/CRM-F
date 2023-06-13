'use strict';

var KTDatatablesExtensionButtons = (function () {
  var initTable3 = function () {
    // begin first table
    var table = $('#kt_table_3').DataTable({
      dom: 'brltip',
      // dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      responsive: true,
      searchCols: [
        null,
        null,
        null,
        null,
        null,
        { search: 'Un-Approved', regex: true },
        null,
      ],
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
        url: '/api/order/view',
        type: 'GET',
      },
      columns: [
        { data: 'title' },
        { data: 'wordcount' },
        { data: 'client' },
        { data: 'hard_deadline' },
        { data: 'createdAt' },
        { data: 'reqActionBy' },
        { data: '_id' },
      ],
      columnDefs: [
        {
          targets: -1,
          render: function (data, type, full, meta) {
            return full.reqActionBy.actionType === 'Un-Approved'
              ? `
            <div class="dropdown">
							<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown">
                                <i class="la la-cog"></i>
                            </a>
						  	<div class="dropdown-menu dropdown-menu-right">
						    	<a class="dropdown-item" href="javascript:;" data-toggle='modal' data-target='#kt_modal_7' onclick="on_accept_order(${meta.row}, '${data}')"><i class="la la-check"></i> Accept</a>
						    	<a class="dropdown-item" href="javascript:;" onclick="reject_order_request(${meta.row})"><i class="la la-close"></i> Reject</a>
						  	</div>
						</div>
            `
              : '<b>Action Taken</b>';
          },
        },
        {
          targets: [2],
          render: function (data) {
            return data.name;
          },
        },
        {
          targets: [3, 4],
          render: function (data) {
            return new Date(data).toLocaleDateString();
          },
        },
        {
          targets: [5],
          render: function (data) {
            var status = {
              'Un-Approved': { title: 'Un-Approved', class: 'kt-badge--brand' },
              Rejected: { title: 'Rejected', class: ' kt-badge--danger' },
              Processing: { title: 'Processing', class: 'kt-badge--warning' },
              Approved: { title: 'Approved', class: ' kt-badge--success' },
              Delivered: { title: 'Delivered', class: ' kt-badge--info' },
            };
            return (
              '<span class="kt-badge ' +
              status[data.actionType].class +
              ' kt-badge--inline kt-badge--pill">' +
              status[data.actionType].title +
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
