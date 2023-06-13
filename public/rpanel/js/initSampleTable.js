'use strict';
var KTDatatablesExtensionButtons = (function () {
  var initTable3 = function () {
    // begin first table
    var table = $('#kt_table_3').DataTable({
      searchDelay: '500ms',
      dom: 'brltip',
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      serverSide: true,
      processing: true,
      oLanguage: { sProcessing: "<div id='loading'></div>" },
      ajax: {
        url: '/apis/bulkdata/table/data',
        type: 'GET',
      },
      columns: [
        { data: 'taskid' },
        { data: 'Year' },
        { data: 'Month' },
        { data: 'uploadtype' },
        { data: 'Link' },
      ],
      columnDefs: [
        {
          targets: 3,
          render: function (data, type, full, meta) {
            var type = {
              task: { title: 'Task', state: 'brand' },
              solution: { title: 'Solution', state: 'success' },
              feedback: { title: 'Feedback', state: 'warning' },
            };
            return `<span id="user_role" class="kt-badge kt-badge--inline kt-badge--pill kt-badge--${
              !!type[data] ? type[data].state : 'info'
            }" style="border-radius:0px; width:100%; font-weight:bold;">${
              !!type[data] ? type[data].title : 'N/A'
            }</span>`;
          },
        },
        {
          targets: 4,
          render: function (data, type, full, meta) {
            var filename = data.substring(data.lastIndexOf('/') + 1);
            return `<a href="${data}" download>${filename}</a>`;
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
      console.log($(this).val());
      table.columns(5).search($(this).val()).draw();
    });

    $('#kt_form_status').selectpicker();

    $('#generalSearch').keyup(function () {
      table.search($(this).val()).draw();
    });
    $('#kt_table_3 tbody').on('click', 'tr', function () {
      var data = table.row(this).data();
      $('#myModal').modal();
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
