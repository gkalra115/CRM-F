var clients = ``;
toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: 'toast-top-right',
  preventDuplicates: false,
  onclick: null,
  showDuration: '300',
  hideDuration: '1000',
  timeOut: '5000',
  extendedTimeOut: '1000',
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut',
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

const completetask = () => {
  swal
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, completed!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    })
    .then(function (result) {
      if (result.value) {
        $.ajax({
          method: 'PUT',
          url: '/manager/task/status/' + $('#taskAssignId').text(),
          success: function (data) {
            if ($.fn.DataTable.isDataTable('#kt_table_3')) {
              $('#kt_table_3').DataTable().destroy();
            }
            $('#kt_table_3 tbody').empty();
            KTDatatablesExtensionButtons.init();
            $('#taskData').hide();
            $('#noTaskSelected').show();
            swal.fire(
              'Completed',
              'This task has marked as completed',
              'success'
            );
            toastr.success('Task Completed Sucessfully');
          },
          error: function (error) {
            toastr.error('Please try again');
          },
        });
      } else if (result.dismiss === 'cancel') {
        swal.fire('Cancelled', 'Please complete it asap', 'error');
      }
    });
};

const taskAssign = () => {
  $.ajax({
    method: 'PUT',
    url: '/api/taskcomm/' + $('#taskAssignId').text(),
    data: {
      assignedto: $('#kt_select2_1').val(),
      softdeadline: $('#softDate').val(),
    },
    success: function (responseData) {
      $('#closeAssign').trigger('click');
      if ($.fn.DataTable.isDataTable('#kt_table_3')) {
        $('#kt_table_3').DataTable().destroy();
      }
      $('#kt_table_3 tbody').empty();
      KTDatatablesExtensionButtons.init(
        $('#changePage').text(),
        $('#hideSelect').text()
      );
      toastr.success('Assigned User Sucessfully');
      $('.taskstatus').empty().append(responseData.updatestatus.status);
      $('#tasklogs').append(
        '<div class="kt-widget4__item"><span class="kt-widget4__icon"><i class="flaticon2-next kt-font-success"></i></span><a class="kt-widget4__title kt-widget4__title--light" href="#"><b>' +
          responseData.updatecomm.assignedby +
          '</b> assigned this task to <b>' +
          responseData.updatecomm.assignedto +
          '</b> on <b>' +
          timesend(responseData.updatecomm.assignedon) +
          '</b></a></div>'
      );
    },
    error: function (error) {
      toastr.error('Not able to assign the task to user');
    },
  });
};

$(document).ready(function () {
  // Getting Clients for Add Task Form
  $.ajax({
    type: 'GET',
    url: '/api/client/view',
    success: function (responseData) {
      let { data } = responseData;
      clients += '<option value="">Select a Client</option>';
      for (i = 0; i < data.length; i++) {
        clients +=
          '<option value="' + data[i]._id + '">' + data[i].name + '</option>';
      }
    },
    error: function (err) {
      toastr.error('Error loading Clients');
    },
  });
  $.ajax({
    type: 'GET',
    url: '/manager/employee/getTeam',
    success: function (responseData) {
      let teamDropdown = `<option value ="">Select an Employee</option>`;
      responseData.forEach((obj) => {
        teamDropdown += `<option value="${obj.id}">${obj.name} - ${obj.role} [Team : ${obj.parent.name}]</option>`;
      });
      $('#kt_select2_1').empty().append(teamDropdown);
    },
    error: function (error) {
      toastr.error('Failed to load user team. ');
    },
  });
});
