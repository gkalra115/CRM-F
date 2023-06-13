"use strict";
var date = new Date();
var empid = $(document).find('title').text();
var KTDatatablesExtensionButtons = (function() {
  var initTable3 = function() {
    // begin first table
    var date = new Date();
    var empid = $(document).find('title').text();
    var table = $("#kt_table_3").DataTable({
      dom: "brtip",
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
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
      ajax: {
        url: `/su/list/effort/${empid}?month=${date.getUTCMonth() + 1}&year=${date.getUTCFullYear()}`,
        type: "GET",
        data: {
          // parameters for custom backend script demo
          columnsDef: ["taskid","title","achived_wordcount", "submittedon", "approved"]
        }
      },
      columns: [
        
        { data: "taskid" },
        { data: "title" },
        { data: "achived_wordcount" },
        { data: "submittedon" },
        { data: "approved" }
      ],
      columnDefs: [
        {
          targets: 0,
          render: function(data, type, full, meta) {
            if(data == undefined){
              return `--`
            }
            else{
              return `<a href="/su/task/${data}" style="color:#000">${data}</a>`;
            }
            
          }
        },
        {
          targets: 1,
          render: function(data, type, full, meta) {
            if(data == null){
              return `--`
            }
            else{
              return data
            };
            }
            
          },
        {
          targets: 4,
          render: function(data, type, full, meta) {
            if(data==true){
              return `

              <span style="overflow: visible; position: relative; width: 125px;">
                  <a href="javascript:;" onclick="aprrovetask('${full._id}')" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details" data-id="${full._id}">
                    <span class="svg-icon svg-icon-primary svg-icon-2x"><!--begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2021-05-14-112058/theme/html/demo1/dist/../src/media/svg/icons/Navigation/Double-check.svg--><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <polygon points="0 0 24 0 24 24 0 24"/>
                          <path d="M9.26193932,16.6476484 C8.90425297,17.0684559 8.27315905,17.1196257 7.85235158,16.7619393 C7.43154411,16.404253 7.38037434,15.773159 7.73806068,15.3523516 L16.2380607,5.35235158 C16.6013618,4.92493855 17.2451015,4.87991302 17.6643638,5.25259068 L22.1643638,9.25259068 C22.5771466,9.6195087 22.6143273,10.2515811 22.2474093,10.6643638 C21.8804913,11.0771466 21.2484189,11.1143273 20.8356362,10.7474093 L17.0997854,7.42665306 L9.26193932,16.6476484 Z" fill="#000000" fill-rule="nonzero" opacity="0.3" transform="translate(14.999995, 11.000002) rotate(-180.000000) translate(-14.999995, -11.000002) "/>
                          <path d="M4.26193932,17.6476484 C3.90425297,18.0684559 3.27315905,18.1196257 2.85235158,17.7619393 C2.43154411,17.404253 2.38037434,16.773159 2.73806068,16.3523516 L11.2380607,6.35235158 C11.6013618,5.92493855 12.2451015,5.87991302 12.6643638,6.25259068 L17.1643638,10.2525907 C17.5771466,10.6195087 17.6143273,11.2515811 17.2474093,11.6643638 C16.8804913,12.0771466 16.2484189,12.1143273 15.8356362,11.7474093 L12.0997854,8.42665306 L4.26193932,17.6476484 Z" fill="#000000" fill-rule="nonzero" transform="translate(9.999995, 12.000002) rotate(-180.000000) translate(-9.999995, -12.000002) "/>
                      </g>
                    </svg><!--end::Svg Icon-->
                  </span>
                 </a>
                 <a href="javascript:;" onclick="updateeffort('${full._id}','${full.taskid}','${full.achived_wordcount}','${full.submittedon}')" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">
                    <span class="svg-icon svg-icon-md">
                       <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                             <rect x="0" y="0" width="24" height="24"></rect>
                             <path d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z" fill="#000000" fill-rule="nonzero" transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) "></path>
                             <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"></rect>
                          </g>
                       </svg>
                    </span>
                 </a>
                 <a href="javascript:;" onclick="deleteeffort('${full._id}')"  class="btn btn-sm btn-clean btn-icon" title="Delete">
                    <span class="svg-icon svg-icon-md">
                       <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                             <rect x="0" y="0" width="24" height="24"></rect>
                             <path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"></path>
                             <path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"></path>
                          </g>
                       </svg>
                    </span>
                 </a>
                 <button class="btn btn btn-success btn-sm">Aprroved </button>
              </span>
              
              `;
            }
            else{
              return `

              <span style="overflow: visible; position: relative; width: 125px;">
                  <a href="javascript:;" onclick="aprrovetask('${full._id}')" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details" data-id="${full._id}">
                    <span class="svg-icon svg-icon-primary svg-icon-2x"><!--begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2021-05-14-112058/theme/html/demo1/dist/../src/media/svg/icons/Navigation/Double-check.svg--><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <polygon points="0 0 24 0 24 24 0 24"/>
                          <path d="M9.26193932,16.6476484 C8.90425297,17.0684559 8.27315905,17.1196257 7.85235158,16.7619393 C7.43154411,16.404253 7.38037434,15.773159 7.73806068,15.3523516 L16.2380607,5.35235158 C16.6013618,4.92493855 17.2451015,4.87991302 17.6643638,5.25259068 L22.1643638,9.25259068 C22.5771466,9.6195087 22.6143273,10.2515811 22.2474093,10.6643638 C21.8804913,11.0771466 21.2484189,11.1143273 20.8356362,10.7474093 L17.0997854,7.42665306 L9.26193932,16.6476484 Z" fill="#000000" fill-rule="nonzero" opacity="0.3" transform="translate(14.999995, 11.000002) rotate(-180.000000) translate(-14.999995, -11.000002) "/>
                          <path d="M4.26193932,17.6476484 C3.90425297,18.0684559 3.27315905,18.1196257 2.85235158,17.7619393 C2.43154411,17.404253 2.38037434,16.773159 2.73806068,16.3523516 L11.2380607,6.35235158 C11.6013618,5.92493855 12.2451015,5.87991302 12.6643638,6.25259068 L17.1643638,10.2525907 C17.5771466,10.6195087 17.6143273,11.2515811 17.2474093,11.6643638 C16.8804913,12.0771466 16.2484189,12.1143273 15.8356362,11.7474093 L12.0997854,8.42665306 L4.26193932,17.6476484 Z" fill="#000000" fill-rule="nonzero" transform="translate(9.999995, 12.000002) rotate(-180.000000) translate(-9.999995, -12.000002) "/>
                      </g>
                    </svg><!--end::Svg Icon-->
                  </span>
                 </a>
                 <a href="javascript:;" onclick="updateeffort('${full._id}','${full.taskid}','${full.achived_wordcount}','${full.submittedon}')" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details">
                    <span class="svg-icon svg-icon-md">
                       <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                             <rect x="0" y="0" width="24" height="24"></rect>
                             <path d="M8,17.9148182 L8,5.96685884 C8,5.56391781 8.16211443,5.17792052 8.44982609,4.89581508 L10.965708,2.42895648 C11.5426798,1.86322723 12.4640974,1.85620921 13.0496196,2.41308426 L15.5337377,4.77566479 C15.8314604,5.0588212 16,5.45170806 16,5.86258077 L16,17.9148182 C16,18.7432453 15.3284271,19.4148182 14.5,19.4148182 L9.5,19.4148182 C8.67157288,19.4148182 8,18.7432453 8,17.9148182 Z" fill="#000000" fill-rule="nonzero" transform="translate(12.000000, 10.707409) rotate(-135.000000) translate(-12.000000, -10.707409) "></path>
                             <rect fill="#000000" opacity="0.3" x="5" y="20" width="15" height="2" rx="1"></rect>
                          </g>
                       </svg>
                    </span>
                 </a>
                 <a href="javascript:;" onclick="deleteeffort('${full._id}')" class="btn btn-sm btn-clean btn-icon" title="Delete">
                    <span class="svg-icon svg-icon-md">
                       <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                             <rect x="0" y="0" width="24" height="24"></rect>
                             <path d="M6,8 L6,20.5 C6,21.3284271 6.67157288,22 7.5,22 L16.5,22 C17.3284271,22 18,21.3284271 18,20.5 L18,8 L6,8 Z" fill="#000000" fill-rule="nonzero"></path>
                             <path d="M14,4.5 L14,4 C14,3.44771525 13.5522847,3 13,3 L11,3 C10.4477153,3 10,3.44771525 10,4 L10,4.5 L5.5,4.5 C5.22385763,4.5 5,4.72385763 5,5 L5,5.5 C5,5.77614237 5.22385763,6 5.5,6 L18.5,6 C18.7761424,6 19,5.77614237 19,5.5 L19,5 C19,4.72385763 18.7761424,4.5 18.5,4.5 L14,4.5 Z" fill="#000000" opacity="0.3"></path>
                          </g>
                       </svg>
                    </span>
                 </a>
                 <button class="btn btn btn-warning btn-sm">Pending </button>
              </span>
              
              `;
            }
              
            
          }
        },
        {
          targets: 3,
          render: function(data, type, full, meta) {
            return convertTableDate(data);
          }
        }
      ],
      footerCallback: function (row, data, start, end, display) {
        var api = this.api(),
            data;
        var total = api
        .column(2)
        .data()
        .reduce(function(a, b) {
            return a + b;
        }, 0);
        // Total over this page
        var pageTotal = api
            .column(2, {
                page: "current"
            })
            .data()
            .reduce(function(a, b) {
                return a + b;
            }, 0);
            $(api.column(3).footer()).html(
               pageTotal + " ( " + total + " total)"
          );
        
      }
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

    $("#kt_form_status").selectpicker();

    $("#generalSearch").keyup(function() {
      table.search($(this).val()).draw();
    });
    $('#kt_datatable_reload').on('click', function () {
      table.ajax.reload();
    });
    $('#kt_dashboard_daterangepicker_3').on(
      'hide.daterangepicker',
      (ev, picker) => {
        const date = ev.format().split('-');
        table.ajax
          .url(`/su/list/effort/${empid}?month=${date[0]}&year=${date[1]}`)
          .load();
          $.ajax({
            type: "GET",
            url: `/su/list/effort/${empid}?month=${date[0]}&year=${date[1]}`,
            success: function(data) {
              $("#totaltask").empty().text(data.stats[0].totaltask);
              $("#totalworecount").empty().text(data.stats[0].totalwordcount);
              // ;
            }
          });
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
      clientfinancestats('EOT');
      $('#kt_dashboard_daterangepicker_date_3').text(`EOT`);
      table.ajax.url(`/su/list/effort/${empid}`).load();
      $.ajax({
        type: "GET",
        url: `/su/list/effort/${empid}`,
        success: function(data) {
          $("#totaltask").empty().text(data.stats[0].totaltask);
          $("#totalworecount").empty().text(data.stats[0].totalwordcount);
          // ;
        }
      });
    });

  
  };
  return {
    //main function to initiate the module
    init: function() {
      initTable3();
    }
  };

  
})(); 

var KTDatatablesExtensionButtons1 = (function() {
  var initTable1 = function() {
    // begin first table
    var date = new Date();
    var empid = $(document).find('title').text();
    var table = $("#kt_table_1").DataTable({
      dom: "brtip",
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      search: {
        regex: true,
      },
      order: [],
      select: true,
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      processing: true,
      searchDelay: 500,
      ajax: {
        url: `/su/api/v1/aitools/credits/${empid}`,
        type: "GET",
        data: {
          // parameters for custom backend script demo
          columnsDef: ["createdAt","tokens","activity"]
        }
      },
      columns: [
        
        { data: "createdAt" },
        { data: "tokens" },
        { data: "activity" }
      ],
      columnDefs: [
        {
          targets: 0,
          render: function(data, type, full, meta) {
            var date = new Date(data)
            var y = date.getFullYear();
            var m = date.getMonth();
            var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            var mon = months[m]
            var d = date.getDate();
            return d+" "+mon+" "+y;
          }
        },
        {
          targets: 1,
          render: function(data, type, full, meta) {
            
              return data;
            }
            
          },
        {
          targets: 2,
          render: function(data, type, full, meta) {
            return data;
            
          }
        }
      ],
    });

  
  };
  return {
    //main function to initiate the module
    init: function() {
      initTable1();
    }
  };

  
})(); 




var employeeid = $(document)
  .find("title")
  .text();

function updateCredits(){
  
  var tokens = $("#tokens").val();
  if(tokens == ""){
    $("#tokenerror").show();
  }
  else{
    KTApp.block('#tokentrasactions', {
      overlayColor: '#000000',
      type: 'v2',
      state: 'success',
      message: 'Please wait...',
    });
    var data = {
      tokens : tokens,
      user: employeeid
    }
    $.ajax({
      type: "POST",
      url: `/su/api/v1/aitools/credits`,
      data: data,
      success: function(data) {
        KTApp.unblock('#tokentrasactions');
        $('#tokenform').trigger("reset");
        console.log(data);
        toastr.success('Effort sucessfully added');
        $('#kt_table_1').DataTable().ajax.reload();
        // ;
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
        console.log(XMLHttpRequest)
        toastr.error(XMLHttpRequest.responseText);
        KTApp.unblock('#tokentrasactions');
        $('#tokenform').trigger("reset");
      } 
    });
  }
 
}

function getCredits(){
  $.ajax({
    type: "GET",
    url: `/su/api/v1/aitools/credits/${empid}`,
    success: function(data) {
      console.log(data)
      // ;
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
      console.log("error")
    } 
  });
}


function createEffort() {
  KTApp.block('#kt_modal_5', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  var taskid = $('#taskidnew').val();
  var title = $('#titlenew').val();
  var achived_wordcount = $('#achived_wordcountnew').val();
  var submittedon = $('#submittedonnew').val();
  if(taskid ==""){
    if(title == ""){
      $("#titleerror").empty().text("Please enter title");
      KTApp.unblock('#kt_modal_5');
    }
    else{
      $("#taskkeyerror").hide()
      $("#titleerror").hide()
      const data123 = {
        title:title,
        achived_wordcount: achived_wordcount,
        submittedon:submittedon
      }
      $.ajax({
        type: "POST",
        url: `/su/list/effort/${empid}`,
        data: data123,
        success: function(data) {
          KTApp.unblock('#kt_modal_5');
          $('#createEffortsheet1').trigger("reset");
          $('#kt_modal_5').modal('toggle');
          toastr.success('Effort sucessfully added');
          $('#kt_table_3').DataTable().ajax.reload();
          // ;
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
          toastr.error(XMLHttpRequest.responseText);
          KTApp.unblock('#kt_modal_5');
          $('#createEffortsheet1').trigger("reset");
        } 
      });
    }
  }
  if(title ==""){
    if(taskid == ""){
      $("#taskkeyerror").empty().text("Please enter TaskId");
      KTApp.unblock('#kt_modal_5');
    }
    else{
      $("#taskkeyerror").hide()
      $("#titleerror").hide()
      const data123 = {
        taskid:taskid,
        achived_wordcount: achived_wordcount,
        submittedon:submittedon
      }
      $.ajax({
        type: "POST",
        url: `/su/list/effort/${empid}`,
        data: data123,
        success: function(data) {
          KTApp.unblock('#kt_modal_5');
          $('#createEffortsheet1').trigger("reset");
          $('#kt_modal_5').modal('toggle');
          toastr.success('Effort sucessfully added');
          $('#kt_table_3').DataTable().ajax.reload();
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) { 
          toastr.error(XMLHttpRequest.responseText);
          KTApp.unblock('#kt_modal_5');
          $('#createEffortsheet1').trigger("reset");
        } 
      });
    }
  }
  $.ajax({
    type: "POST",
    url: `/su/list/effort/${empid}`,
    data: data,
    success: function(data) {
      KTApp.unblock('#kt_modal_5');
      $('#createEffortsheet1').trigger("reset");
      $('#kt_modal_5').modal('toggle');
      toastr.success('Effort sucessfully added');
      $('#kt_table_3').DataTable().ajax.reload();
      // ;
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
      toastr.error(XMLHttpRequest.responseText);
      KTApp.unblock('#kt_modal_5');
      $('#createEffortsheet1').trigger("reset");
    } 
  });
}
$('#tillEot').on('click', () => {
  clientfinancestats('EOT');
  $('#kt_dashboard_daterangepicker_date_3').text(`EOT`);
  
  //table.ajax.url(`/api/task/client/${clientid}`).load();
});
jQuery(document).ready(function() {
  KTDatatablesExtensionButtons.init();
  KTDatatablesExtensionButtons1.init();
  var todayDate = new Date();
  var month = todayDate.getMonth() + 1;
  var year = todayDate.getFullYear();
  clientfinancestats(`${month}-${year}`);
  daterangepickerInit();
  var empid = $(document).find('title').text();
  $.ajax({
    type: "GET",
    url: `/su/list/effort/${empid}?month=${date.getUTCMonth() + 1}&year=${date.getUTCFullYear()}`,
    success: function(data) {
      $(".demo").hide("fast");
      $("#totaltask").text(data.stats[0].totaltask);
      $("#totalworecount").text(data.stats[0].totalwordcount);
      // ;
    }
  });
  $.ajax({
    type: "GET",
    url: `/su/api/v1/aitools/tokens/${empid}`,
    success: function(data) {
      if(data){
      $("#tokensremain").append("Token remaining: "+data.data[0].updatedtokens);
      }
      $("#totalworecount").text(data.stats[0].totalwordcount);
      // ;
    }
  });
});
const deleteeffort = data =>{
  Swal.fire({
    title: "Sure?",
    text: "You want to delete this Effort",
    icon: "success",
    buttonsStyling: false,
    confirmButtonText: "Confirm!",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    customClass: {
     confirmButton: "btn btn-success",
     cancelButton: "btn btn-default"
    }
   }).then((result) => {
     if(result.value == true){
      $.ajax({
        type: 'DELETE',
        url: `/su/list/deleteeffort/${data}`,
        success: function (returndata) {
          toastr.success('Effort Deleted')
          $('#kt_table_3').DataTable().ajax.reload();

        }
      });
     }
    
    
    
    
    
   });
}
const aprrovetask = data =>{

  Swal.fire({
    title: "Sure?",
    text: "You want to approve the effort",
    icon: "success",
    buttonsStyling: false,
    confirmButtonText: "Confirm!",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    customClass: {
     confirmButton: "btn btn-success",
     cancelButton: "btn btn-default"
    }
   }).then((result) => {
     console.log()
     if(result.value == true){
      $.ajax({
        type: 'PUT',
        url: `/su/list/approval/${data}`,
        success: function (returndata) {
          toastr.success('Effort Approved')
          $('#kt_table_3').DataTable().ajax.reload();
        }
    });
     }
   
    
    
   });
   
}
function updateeffort(id,takid,wordcount,date){
  $('#kt_modal_4.modal').modal('show');
  $('#modalTitle').empty().text(`Update Effort`);
  $('#taskid123').empty().val(takid);
  $('#taskkeyhidden').empty().val(id);
  $('#achived_wordcount').empty().val(wordcount);
  var submitedon = new Date(date);
  var day = ("0" + submitedon.getDate()).slice(-2);
  var month = ("0" + (submitedon.getMonth() + 1)).slice(-2);
  var subdate = submitedon.getFullYear()+"-"+(month)+"-"+(day) ;
  console.log(subdate)
  $('#submittedon').val(subdate);

  
}
function updateEfforts() {
  KTApp.block('#kt_modal_4', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  var taskid = $('#taskid123').val();
  var effortid = $('#taskkeyhidden').val();
  var achived_wordcount = $('#achived_wordcount').val();
  var submittedon = $('#submittedon').val();
  const data = {
    taskid: taskid,
    achived_wordcount: achived_wordcount,
    submittedon:submittedon,
    approved:true
  }
  console.log(effortid)
  $.ajax({
    type: 'PUT',
    url: `/su/list/effortupdate/${effortid}`,
    data: data,
    success: function (returndata) {
      KTApp.unblock('#kt_modal_4');
      $('#createEffortsheet').trigger("reset");
      $('#kt_modal_4').modal('toggle');
      toastr.success('Effort sucessfully added');
      $('#kt_table_3').DataTable().ajax.reload();
      // ;
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) { 
      toastr.error(XMLHttpRequest.responseText);
      KTApp.unblock('#kt_modal_4');
    } 
})
}
const convertTableDate = date => {

  let current_datetime = new Date(date);
  current_datetime.toDateString()
  return current_datetime;
};

var clientfinancestats = function (value) {
  var empid = $(document).find('title').text();
  var cMonth = value
    ? value === 'EOT'
      ? 'EOT'
      : value.split('-')[0]
    : currentDate.getMonth() + 1;
  var gMonth = value
    ? value === 'EOT'
      ? 'EOT'
      : value.split('-')[0] - 1
    : currentDate.getMonth();
  var cYear = value
    ? value === 'EOT'
      ? 'EOT'
      : value.split('-')[1]
    : currentDate.getFullYear();
  var apiUrl;
  if ((cMonth === 'EOT', gMonth === 'EOT', cYear === 'EOT')) {
    apiUrl = `/su/list/${empid}`;
    $(".kt-widget__info").hide()
    $("#ttotal").hide()
  } else {
    apiUrl = `/su/list/${empid}?month=${cMonth}&year=${cYear}`;
    $(".kt-widget__info").show()
    $("#ttotal").show()
  }
  $.ajax({
    type: 'GET',
    url: apiUrl,
    success: function (data) {
      var totalwordcount = 26*2000;
        var totalachieved = data.stats[0].totalwordcount;
        var percentage = Math.round((totalachieved/totalwordcount)*100)+"%"
        $(".kt-widget__stats").text(percentage);
        $("#totaltask").text(data.stats[0].totaltask);
        $("#totalwordcount").text(totalwordcount);
        $("#achivedwordcount").text(totalachieved);
        $(".progress-bar").css("width",percentage);
        $(".progress-bar").attr("aria-valuenow",percentage);
    },
  });
};

var daterangepickerInit = function () {
  var todayDate = new Date();
  var month = todayDate.getMonth() + 1;
  var year = todayDate.getFullYear();
  $('#kt_dashboard_daterangepicker_date_3').text(` ${month}-${year}`);
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
      clientfinancestats(value);
    });
};

