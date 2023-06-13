'use strict';

const  createdataset = () => {
    KTApp.block('#datasetgenerate', {});
    var data1 = {
        prompt : $("#promptsentence").val(),
        completion: $("#paraphrasedsentence").val()
    }
    console.log(data1)
    KTApp.unblock('#datasetgenerate', {});
    $.ajax({
        type: "POST",
        url: "/su/api/v1/aitools/parphraser/dataset",
        data: data1,
        success: function (data) {
            KTApp.unblock('#datasetgenerate', {});
            toastr.success('Dataset Saved');
            $('#kt_table_3').DataTable().ajax.reload();
        },
        error: function (jqXHR, exception) {
            KTApp.unblock('#datasetgenerate', {});
            toastr.error('Error encountered');
        }
    })
}

const resetform = () =>{
    $('#createdataset').trigger("reset");
}

var table;
var KTDatatablesExtensionButtons = (function () {
  var initTable3 = function () {
    // begin first table
    table = $('#kt_table_3').DataTable({
        lengthMenu: [
            [10, 25, 50, 100, 500, 1000, -1],
            [10, 25, 50, 100, 500, 1000, 'All'],
        ],
      dom: 'brltip',
      // dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
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
        url: '/su/api/v1/aitools/parphraser/dataset',
        type: 'GET',
        data: {
          columnsDef: ['prompt', 'completion', 'checked', '_id'],
        },
      },
      columns: [
        { data: 'prompt' },
        { data: 'completion' },
        { data: 'checked' },
        { data: '_id' },
      ],
      columnDefs: [
        {
          targets: 0,
          render: function (data, type, full, meta) {
            return data;
          },
        },
        {
          targets: 2,
          render: function (data, type, full, meta) {
            
            var plagpercentage = similarity(full.prompt, full.completion);
            var plag = Math.round(plagpercentage*100)
            if(plag>=0 && plag <30){
                return '<button class="btn btn btn-success btn-sm">'+plag+'%</button>'
            }
            else if(plag>30 && plag <=50){
                return '<button class="btn btn btn-info btn-sm">'+plag+'%</button>'
            }
            else if(plag>50 && plag <=75){
                return '<button class="btn btn btn-warning btn-sm">'+plag+'%</button>'
            }
            else if(plag=>75 && plag <100){
                return '<button class="btn btn btn-danger btn-sm">'+plag+'%</button>'
            }
          },
        },
        {
            targets: 3,
            render: function(data, type, full, meta){
                if(full.checked==true){
                    return `

              <span style="overflow: visible; position: relative; width: 125px;">
                  <a href="javascript:;" onclick="approvedata('${full._id}')" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details" data-id="${full._id}">
                    <span class="svg-icon svg-icon-primary svg-icon-2x"><!--begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2021-05-14-112058/theme/html/demo1/dist/../src/media/svg/icons/Navigation/Double-check.svg--><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                          <polygon points="0 0 24 0 24 24 0 24"/>
                          <path d="M9.26193932,16.6476484 C8.90425297,17.0684559 8.27315905,17.1196257 7.85235158,16.7619393 C7.43154411,16.404253 7.38037434,15.773159 7.73806068,15.3523516 L16.2380607,5.35235158 C16.6013618,4.92493855 17.2451015,4.87991302 17.6643638,5.25259068 L22.1643638,9.25259068 C22.5771466,9.6195087 22.6143273,10.2515811 22.2474093,10.6643638 C21.8804913,11.0771466 21.2484189,11.1143273 20.8356362,10.7474093 L17.0997854,7.42665306 L9.26193932,16.6476484 Z" fill="#000000" fill-rule="nonzero" opacity="0.3" transform="translate(14.999995, 11.000002) rotate(-180.000000) translate(-14.999995, -11.000002) "/>
                          <path d="M4.26193932,17.6476484 C3.90425297,18.0684559 3.27315905,18.1196257 2.85235158,17.7619393 C2.43154411,17.404253 2.38037434,16.773159 2.73806068,16.3523516 L11.2380607,6.35235158 C11.6013618,5.92493855 12.2451015,5.87991302 12.6643638,6.25259068 L17.1643638,10.2525907 C17.5771466,10.6195087 17.6143273,11.2515811 17.2474093,11.6643638 C16.8804913,12.0771466 16.2484189,12.1143273 15.8356362,11.7474093 L12.0997854,8.42665306 L4.26193932,17.6476484 Z" fill="#000000" fill-rule="nonzero" transform="translate(9.999995, 12.000002) rotate(-180.000000) translate(-9.999995, -12.000002) "/>
                      </g>
                    </svg><!--end::Svg Icon-->
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
                        <a href="javascript:;" onclick="approvedata('${full._id}')" class="btn btn-sm btn-clean btn-icon mr-2" title="Edit details" data-id="${full._id}">
                          <span class="svg-icon svg-icon-primary svg-icon-2x"><!--begin::Svg Icon | path:/var/www/preview.keenthemes.com/metronic/releases/2021-05-14-112058/theme/html/demo1/dist/../src/media/svg/icons/Navigation/Double-check.svg--><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
                            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <polygon points="0 0 24 0 24 24 0 24"/>
                                <path d="M9.26193932,16.6476484 C8.90425297,17.0684559 8.27315905,17.1196257 7.85235158,16.7619393 C7.43154411,16.404253 7.38037434,15.773159 7.73806068,15.3523516 L16.2380607,5.35235158 C16.6013618,4.92493855 17.2451015,4.87991302 17.6643638,5.25259068 L22.1643638,9.25259068 C22.5771466,9.6195087 22.6143273,10.2515811 22.2474093,10.6643638 C21.8804913,11.0771466 21.2484189,11.1143273 20.8356362,10.7474093 L17.0997854,7.42665306 L9.26193932,16.6476484 Z" fill="#000000" fill-rule="nonzero" opacity="0.3" transform="translate(14.999995, 11.000002) rotate(-180.000000) translate(-14.999995, -11.000002) "/>
                                <path d="M4.26193932,17.6476484 C3.90425297,18.0684559 3.27315905,18.1196257 2.85235158,17.7619393 C2.43154411,17.404253 2.38037434,16.773159 2.73806068,16.3523516 L11.2380607,6.35235158 C11.6013618,5.92493855 12.2451015,5.87991302 12.6643638,6.25259068 L17.1643638,10.2525907 C17.5771466,10.6195087 17.6143273,11.2515811 17.2474093,11.6643638 C16.8804913,12.0771466 16.2484189,12.1143273 15.8356362,11.7474093 L12.0997854,8.42665306 L4.26193932,17.6476484 Z" fill="#000000" fill-rule="nonzero" transform="translate(9.999995, 12.000002) rotate(-180.000000) translate(-9.999995, -12.000002) "/>
                            </g>
                          </svg><!--end::Svg Icon-->
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
        }
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


    $('#generalSearch').keyup(function () {
      table.search($(this).val()).draw();
    });

    $('#kt_datatable_reload').on('click', function () {
      table.ajax.reload();
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


})
function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
  }

  function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
  }
  //console.log(similarity("That is a happy person","That is a happy dog"))
  const approvedata = data =>{

    Swal.fire({
      title: "Sure?",
      text: "You want to approve the Data",
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
          type: 'PUT',
          url: `/su/api/v1/aitools/parphraser/${data}`,
          data: {checked:true},
          success: function (returndata) {
            toastr.success('Data Approved')
            $('#kt_table_3').DataTable().ajax.reload();
          }
      });
       }
     
      
      
     });
     
  }

  const deleteeffort = data =>{
    // Swal.fire({
    //   title: "Sure?",
    //   text: "You want to delete this Effort",
    //   icon: "success",
    //   buttonsStyling: false,
    //   confirmButtonText: "Confirm!",
    //   showCancelButton: true,
    //   cancelButtonText: "Cancel",
    //   customClass: {
    //    confirmButton: "btn btn-success",
    //    cancelButton: "btn btn-default"
    //   }
    //  }).then((result) => {
    //    if(result.value == true){
        $.ajax({
          type: 'DELETE',
          url: `/su/api/v1/aitools/parphraser/${data}`,
          success: function (returndata) {
            toastr.success('Datafile Deleted')
            $('#kt_table_3').DataTable().ajax.reload();
  
          }
        });
    //    }
    //  });
  }

  async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/prithivida/grammar_error_correcter_v1",
      {
        headers: { Authorization: "Bearer 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" },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }
  
  query({"inputs": "The answer to the universe is"}).then((response) => {
    console.log(JSON.stringify(response));
  });