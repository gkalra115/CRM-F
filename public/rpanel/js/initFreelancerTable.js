"use strict";
var KTDatatablesExtensionButtons = (function() {
  var initTable3 = function() {
    // begin first table
    var table = $("#kt_table_3").DataTable({
      dom: "brltip",
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
        },
      ],
      processing: true,
      searchDelay: 500,
      ajax: {
        url: "/api/freelancer/view",
        type: "GET",
        data: {
          // parameters for custom backend script demo
          columnsDef: [
            "_id",
            "email",
            "name",
            "phone",
            "is_active"
          ]
        }
      },
      columns: [
        { data: "email" },
        { data: "name" },
        { data: "phone" },
        { data: "is_active" },
        { data: "_id"}
      ],
      columnDefs: [
        {
          targets: -1,
		  title: "Actions",
		  responsivePriority: -1,
          orderable: false,
          render: function(data, type, full, meta) {
            return `<a class="btn btn-sm btn-clean btn-icon btn-icon-md" onclick="toggleFreelancerCanvas('${data}')" title="View">
						<i class="la la-eye"></i>
					  </a>
					  <a onclick= editFreelancer('${data}') class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="modal" data-target="#kt_modal_4" title="View">
						<i class="la la-edit"></i>
					  </a>
					  <a onclick=deleteFreelancer('${data}') class="btn btn-sm btn-clean btn-icon btn-icon-md" title="View">
						<i class="la la-trash"></i>
					  </a>`;
          }
        },
        {
          targets: 3,
          render: function(data, type, full, meta) {
            var status = {
              1: { title: "In-Active", state: "danger" },
              2: { title: "Active", state: "success" }
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
                "</span>"
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
              "</span>"
            );
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

    $('#kt_form_status').on('change', function() {
			table.columns(3).search($(this).val()).draw();
		});

    $('#kt_form_status').selectpicker();
    
    $('#generalSearch').keyup(function(){
      table.search($(this).val()).draw() ;
    })
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
});
