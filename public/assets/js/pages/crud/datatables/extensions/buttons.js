"use strict";
var KTDatatablesExtensionButtons = function() {

	var initTable2 = function() {

		// begin first table
		var table = $('#kt_table_2').DataTable({
			responsive: true,
			buttons: [
				'print',
				'copyHtml5',
				'excelHtml5',
				'csvHtml5',
				'pdfHtml5',
			],
			processing: true,
			searchDelay: 500,
			ajax: {
				url: '/apis/v2/su/view/employee/active',
				type: 'GET',
				data: {
					// parameters for custom backend script demo
					columnsDef: [
						'_id', 'email', 'name',
						'phone', 'user_type', 'is_active'],
				},
			},
			columns: [
				{data: '_id'},
				{data: 'email'},
				{data: 'name'},
				{data: 'phone'},
				{data: 'employee.user_role'},
				{data: 'is_active'},
			],
			columnDefs : [
				{
					targets: 5,
					render: function(data, type, full, meta) {
						var status = {
							1: {'title': 'In-Active', 'state': 'danger'},
							2: {'title': 'Active', 'state': 'success'},
						};
						if (data) {
							return '<span class="kt-badge kt-badge--' + status[2].state + ' kt-badge--dot"></span>&nbsp;' +
							'<span class="kt-font-bold kt-font-' + status[2].state + '">' + status[2].title + '</span>';;
						}
						return '<span class="kt-badge kt-badge--' + status[1].state + ' kt-badge--dot"></span>&nbsp;' +
							'<span class="kt-font-bold kt-font-' + status[1].state + '">' + status[1].title + '</span>';
					},
				},
				{
					targets: 4,
					render: function(data, type, full, meta) {
						// var status = {
						// 	1: {'title': 'Pending', 'class': 'kt-badge--brand'},
						// 	2: {'title': 'Delivered', 'class': ' kt-badge--danger'},
						// 	3: {'title': 'Canceled', 'class': ' kt-badge--primary'},
						// 	4: {'title': 'Success', 'class': ' kt-badge--success'},
						// 	5: {'title': 'Info', 'class': ' kt-badge--info'},
						// 	6: {'title': 'Danger', 'class': ' kt-badge--danger'},
						// 	7: {'title': 'Warning', 'class': ' kt-badge--warning'},
						// };
						// if (typeof status[data] === 'undefined') {
						// 	return data;
						// }
						switch(data){
							case "SuperAdmin":
								return '<span class="kt-badge kt-badge--inline kt-badge--pill" style="background-color:#000; color:#fff;">' + data + '</span>';
							case "Admin":
								return '<span class="kt-badge kt-badge--danger kt-badge--inline kt-badge--pill">' + data + '</span>';
							case "Manager":
								return '<span class="kt-badge kt-badge--warning kt-badge--inline kt-badge--pill">' + data + '</span>';
							case "TeamLead":
								return '<span class="kt-badge kt-badge--success kt-badge--inline kt-badge--pill">' + data + '</span>';
							case "Expert":
								return '<span class="kt-badge kt-badge--brand kt-badge--inline kt-badge--pill">' + data + '</span>';
						}
						
					}
				}
			]
		});

		$('#export_print').on('click', function(e) {
			e.preventDefault();
			table.button(0).trigger();
		});

		$('#export_copy').on('click', function(e) {
			e.preventDefault();
			table.button(1).trigger();
		});

		$('#export_excel').on('click', function(e) {
			e.preventDefault();
			table.button(2).trigger();
		});

		$('#export_csv').on('click', function(e) {
			e.preventDefault();
			table.button(3).trigger();
		});

		$('#export_pdf').on('click', function(e) {
			e.preventDefault();
			table.button(4).trigger();
		});

	};

	return {

		//main function to initiate the module
		init: function() {
			
			initTable2();
		},

	};

}();

jQuery(document).ready(function() {
	KTDatatablesExtensionButtons.init();
});