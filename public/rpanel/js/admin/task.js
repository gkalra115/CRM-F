var clients = ``;
var clients = ``;
var form = $('#createTask')
form.validate({
  rules:{
    title : {
      required : true,
    },
    wordcount : {
      required : true,
      number : true
    },
    softdeadline : {
      required : true,
      date : true
    },
    harddeadline : {
      required : true,
      date : true
    },  
    selectclient : {
      required: true
    }
  }
})
toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: "toast-top-right",
  preventDuplicates: false,
  onclick: null,
  showDuration: "300",
  hideDuration: "1000",
  timeOut: "5000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut"
};
const createTask = (id = undefined) => {
  if (!form.valid()) {
    return;
  }
  KTApp.block("#kt_modal_4", {
    overlayColor: "#000000",
    type: "v2",
    state: "success",
    message: "Please wait..."
  });
  var taskData = {
    title: $("#createTask #title").val(),
    wordcount: $("#createTask #wordcount").val(),
    soft_deadline: $("#createTask #softdeadline").val(),
    hard_deadline: $("#createTask #harddeadline").val(),
    client: $("#createTask #selectclient").val(),
    description: $("#createTask #textdescription").summernote("code")
  };
  if (id === undefined) {
    $.ajax({
      type: "POST",
      url: "/admin/task/create",
      data: taskData,
      success: function(data) {
          $("#taskkey").empty().append("Task Details");
          $("#createTask").trigger("reset");
          displayFilteredTable($("#changePage").text(), $("#hideSelect").text());
          KTApp.unblock("#kt_modal_4");
          $("#kt_modal_4").modal("toggle");
          toastr.success("Task Added");
      },
      error: function(err) {
        KTApp.unblock("#kt_modal_4");
        $("#kt_modal_4").modal("toggle");
        toastr.error(err.responseText);
      }
    });
  } else {
    $.ajax({
      type: "PUT",
      url: `/admin/task/${id}`,
      data: taskData,
      success: function(data) {
        
          $("#taskkey").empty().append("Task Details");
          $("#createTask").trigger("reset");
          displayFilteredTable($("#changePage").text(), $("#hideSelect").text());
          KTApp.unblock("#kt_modal_4");
          $("#kt_modal_4").modal("toggle");
          toastr.success("Task Addedd");
      },
      error: function(err) {
        KTApp.unblock("#kt_modal_4");
        $("#kt_modal_4").modal("toggle");
        toastr.error(err.responseText);
      }
    });
  }
};

// const toggleTaskCanvas = (id) => {
// KTApp.block("#taskDetail", {
//   overlayColor: "#ccc",
//   type: "v2",
//   state: "success",
//   message: "Please wait..."
// })

// setTimeout(function(){

//   KTApp.unblock("#taskDetail");
// },2000)

//   // KTApp.block("#kt_quick_panel", {
//   //   overlayColor: "#000",
//   //   type: "v2",
//   //   state: "success",
//   //   message: "Please wait...",
//   // });
//   // $.ajax({
//   //   type : "GET",
//   //   url : `/apis/v2/su/view/${id}`,
//   //   success : function(data){
//   //     console.log(data)
//   //     let { name, phone, email, is_active, employee} = data
//   //     $("#kt-widget__title").empty().append(name)
//   //     $("#kt-widget__desc").empty().append(email)
//   //     $("#kt-widget__label_status").empty().append((is_active ? `<span class="btn btn-label-success btn-sm btn-bold btn-upper">Active</span>` : `<span class="btn btn-label-success btn-sm btn-bold btn-upper">In-Active</span>`))
//   //     $("#kt-widget__label_phone").empty().append(phone)
//   //     $("#kt-widget__subtitle_salary").empty().append(`&#8377;`+employee.salary)
//   //     $("#kt-widget__subtitle_jDate").empty().append((employee.joiningDate).split("T")[0])
//   //   }
//   // })
//   // $("#kt_quick_panel_toggler_btn").trigger("click")
//   // setTimeout(function() {
//   //   KTApp.unblock("#kt_quick_panel");
//   // }, 2000)
// }

const clearForm = () => {
  $("#kt_modal_4").modal("toggle");
  $("#createTask").trigger("reset");
  $("#textdescription").summernote("code", "");
  $("#selectclient")
    .empty()
    .append(clients);
  $("#createTask #statusInput").hide("fast");
  $("#actionButton")
    .attr(`onclick`, `createTask()`)
    .empty()
    .append("Create");
  $("#modalTitle")
    .empty()
    .append("Add Task");
};


const deletetask = () =>{
  swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
    reverseButtons: true
}).then(function(result){
    if (result.value) {
      $.ajax({
        method: "DELETE",
        url: "/admin/task/" + $("#taskAssignId").text(),
        success: function(data){
          if ($.fn.DataTable.isDataTable("#kt_table_3")) {
            $("#kt_table_3")
              .DataTable()
              .destroy();
          }
          $("#kt_table_3 tbody").empty();
          KTDatatablesExtensionButtons.init("201");
          $('#taskData').hide();
          $('#noTaskSelected').show();
          swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
        )
        toastr.success("Task Deleted Sucessfully");
        },
        error: function(error){
          toastr.error("Please try again");
        }
      })
        
    } else if (result.dismiss === 'cancel') {
        swal.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
        )
    }
});
  
}
const taskAssign = () => {
  $.ajax({
    method: "PUT",
    url: "/api/taskcomm/" + $("#taskAssignId").text(),
    data: {
      assignedto: $("#kt_select2_1").val(),
      softdeadline: $("#softDate").val()
    },
    success: function(responseData) {
      $("#closeAssign").trigger("click");
      toastr.success("Assigned User Sucessfully");
      $(".taskstatus")
        .empty()
        .append(responseData.updatestatus.status);
      $("#tasklogs").append(
        '<div class="kt-widget4__item"><span class="kt-widget4__icon"><i class="flaticon2-next kt-font-success"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
          responseData.updatecomm.assignedby +
          "</b> assigned this task to <b>" +
          responseData.updatecomm.assignedto +
          "</b> on <b>" +
          timesend(responseData.updatecomm.assignedon) +
          "</b></a></div>"
      );
    },
    error: function(error) {
      toastr.error("Not able to assign the task to user");
    }
  });
};

const editTaskFill = () => {
  form.clearForm();
  $("#actionButton")
    .attr(`onclick`, `createTask('${currentTask._id}')`)
    .empty()
    .append("Edit");
  form.validate().resetForm();
  $("#selectclient")
    .empty()
    .append(clients);
  form.find("#title").val(currentTask.title)
  form.find("#wordcount").val(currentTask.wordcount)
  form.find("#softdeadline").val(currentTask.soft_deadline.split("T")[0])
  form.find("#harddeadline").val(currentTask.hard_deadline.split("T")[0])
  form.find("#textdescription").summernote("code",currentTask.description)
  form.find("#selectclient").val(currentTask.client._id)
}

$(document).ready(function() {
  // Getting Clients for Add Task Form
  $.ajax({
    type: "GET",
    url: "/api/client/view",
    success: function(responseData) {

      let { data } = responseData;
      clients += '<option value="">Select a Client</option>';
      for (i = 0; i < data.length; i++) {
        clients +=
          '<option value="' + data[i]._id + '">' + data[i].name + "</option>";
      }
    },
    error: function(err) {
      toastr.error("Error loading Clients");
    }
  });
  $.ajax({
    type: "GET",
    url: "/admin/employee/getTeam",
    success: function(responseData) {
      let teamDropdown = `<option value ="">Select an Employee</option>`;
      responseData.forEach(obj => {
        teamDropdown += `<option value="${obj.id}">${obj.name} - ${obj.role} [Team : ${obj.parent.name}]</option>`;
      });
      $("#kt_select2_1")
        .empty()
        .append(teamDropdown);
    },
    error: function(error) {
      toastr.error("Failed to load user team. ");
    }
  });
});
