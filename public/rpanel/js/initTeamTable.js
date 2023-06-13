"use strict";

var taskId;

var KTDatatablesExtensionButtons = (function() {
  var initTable4 = function() {
    // begin first table
    var table = $("#kt_table_4").DataTable({
      dom: 'tpi',
	//   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      responsive: true,
      select: {
        style:  "single"},
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
        url: "/api/task/view",
        type: "GET",
        data: {
          // parameters for custom backend script demo
          columnsDef: [
            "_id",
            "title",
            "deadline",
            "wordcount",
            "created by",
            "client"
          ]
        }
      },
      columns: [
        { data: "_id" }
      ],
      // createdRow: function( row, data, dataIndex ) {
      //     $(row).attr('onclick', `toggleTaskCanvas('${data._id}')`);
      // },
      columnDefs: [
        {
          targets : 0,
          render : function(data,type,full,meta){
              var dateHard = convertTableDate(full.hard_deadline);
              var dateSoft = convertTableDate(full.soft_deadline);
              return `
              <div class="kt-widget5">
                <div class="kt-widget5__item">
                  <div class="kt-widget5__content">
                    <div class="kt-widget5__section"><span class="kt-widget5__title" style="font-size:1.3rem;pointer-events:none">${full.title}</span>
                      <div class="kt-widget5__info" style="padding: 0.5rem 0">
                        <span>Belongs to <span class="kt-font-info" style="font-weight:600">${full.client.name}</span> [Client]
                        </span>
                      </div>
                      <div class="kt-widget5__info">
                        <span>
                        Created by 
                          <span class="kt-font-info" style="font-weight:600">${full.createdby.name} </span>
                        </span>
                      </div>
                      <div class="kt-widget5__info" style="padding: 0.5rem 0">
                        <span>
                        Total Word Count 
                          <span class="kt-font-info" style="font-weight:600">${full.wordcount} </span>
                        </span>
                      </div>
                      
                    </div>
                  </div>
                  <div class="kt-widget5__content">
                    <div class="kt-widget5__stats">
                      <span class="btn btn-label-success btn-sm btn-bold btn-upper">${dateSoft}
                      </span>
                      <span class="kt-font-bold kt-font-success" style="text-align:center;margin-top:0.5rem;">Soft Deadline</span>
                    </div>
                    <div class="kt-widget5__stats">
                      <span class="btn btn-label-danger btn-sm btn-bold btn-upper">${dateHard}
                      </span>
                      <span class="kt-font-bold kt-font-danger" style="text-align:center;margin-top:0.5rem;">Hard Deadline</span>
                    </div>
                  </div>
                </div>
              </div>
              `
            }
      }
      ]
    });
      //Adding Row select to retrive row information
    $('#kt_table_4 tbody').on( 'click', 'tr', function () {
        var rowData = table.rows(table.row( this ).index()).data()[0]
        $("#noTaskSelected").hide("fast")
        $("#taskData").fadeIn("slow")
        if ($('#taskId').text() === rowData._id){
          $("#taskData").hide()
          $('#taskId').empty()
          $("#noTaskSelected").fadeIn("slow")
          return 0
        }
        KTApp.block("#taskDetail", {
          overlayColor: "#ccc",
          type: "v2",
          state: "success",
          message: "Please wait..."
        })
        if ($('#taskId').text() !== rowData._id) {
          $('#initChar').empty().append((rowData.title).charAt(0))
          $('#taskTitle').empty().append(rowData.title)
          $('#taskId').empty().append(rowData._id)
          // $('#taskClientName').empty().append(rowData.client.name)
          // $('#taskClientEmail').empty().append(rowData.client.email)
          // $('#taskClientPhone').empty().append(rowData.client.phone)
          // $('#taskSoft').empty().append(convertTableDate(rowData.soft_deadline))
          // $('#taskHard').empty().append(convertTableDate(rowData.hard_deadline))
          $('#taskCreated').empty().append(convertTableDate(rowData.createdAt))
          $('#taskModified').empty().append(convertTableDate(rowData.updatedAt))
          $('#taskDesc').empty().append(rowData.description)
          // $('#taskWord').empty().append(rowData.wordcount)
          // $('#taskCreatedName').empty().append(rowData.createdby.name)
          // $('#taskCreatedEmail').empty().append(rowData.createdby.email)
          // $('#taskCreatedPhone').empty().append(rowData.createdby.phone)
        }
        taskId = rowData._id
        setTimeout(function(){
    
          KTApp.unblock("#taskDetail");
        },2000)
    });
  };

  return {
    //main function to initiate the module
    init: function() {
      initTable4();
    }
  };
})();

const convertTableDate = (date) => {
  var months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let current_datetime = new Date(date)
  var formatted_date = current_datetime.getDate() + " " + months[current_datetime.getMonth()] + " " + current_datetime.getFullYear()
  return formatted_date
}

const convertFormDate = (date) => {
  var formatted_date = date.split(" ")
  var months = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${formatted_date[2]}-${months.indexOf(formatted_date[1]).toString().length > 1 ? months.indexOf(formatted_date[1]) + 1 : '0' + months.indexOf(formatted_date[1]) + 1}-${formatted_date[0]}`
}

jQuery(document).ready(function() {
  KTDatatablesExtensionButtons.init();
});
