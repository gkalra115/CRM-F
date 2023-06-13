var form = $("#createEmployee");
form.validate({
  rules: {
    email: {
      required: true,
      email: true,
    },
    name: {
      required: true,
    },
    phone: {
      required: true,
      number: true,
    },
    salary: {
      required: true,
      number: true,
    },
    university: {
      required: true,
    },
    joiningDate: {
      required: true,
    },
    user_role: {
      required: true,
    },
    statusInput: {
      required: true,
    },
  },
});
var showEmployeeErrorMsg = function (form, type, msg) {
  KTApp.unblock("#kt_modal_4");
  var subj = ``;
  msg.forEach((obj) => {
    subj += `<li>${obj.msg}</li>`;
  });
  var alert = $(
    '<div class="alert alert-' +
      type +
      ' alert-dismissible" role="alert">\
    <div class="alert-text"><ul>' +
      subj +
      '</ul></div>\
    <div class="alert-close">\
              <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
          </div>\
  </div>'
  );

  form.find(".alert").remove();
  alert.prependTo(form);
  //alert.animateClass('fadeIn animated');
  KTUtil.animateClass(alert[0], "fadeIn animated");
  alert.find("span").html(msg);
};
const createEmployee = (id = undefined, rowindex) => {
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
    hideMethod: "fadeOut",
  };
  if (!form.valid()) {
    return;
  }
  KTApp.block("#kt_modal_4", {
    overlayColor: "#000000",
    type: "v2",
    state: "success",
    message: "Please wait...",
  });
  var employeeData = {
    id: id,
    email: $("#createEmployee #email").val(),
    name: $("#createEmployee #name").val(),
    phone: $("#createEmployee #phone").val(),
    salary: $("#createEmployee #salary").val(),
    joiningDate: $("#createEmployee #joiningDate").val(),
    user_role: $("#createEmployee #user_role").val(),
    is_active: $("#createEmployee #status").val() === "Active" ? true : false,
  };

  if (id === undefined) {
    $.ajax({
      type: "POST",
      url: "/api/employee/create",
      data: employeeData, // serializes the form's elements.
      success: function (data) {
        if (data.redirect) {
          return (window.location.href = data.redirect);
        }
        if (data.msg === "error") {
          return showEmployeeErrorMsg(form, "danger", data.errors);
        }
        setTimeout(function () {
          form.clearForm();
          var table = $("#kt_table_3").DataTable();
          table.ajax.reload();
          KTApp.unblock("#kt_modal_4");
          $("#kt_modal_4").modal("toggle");
          toastr.success("New Employee Added");
        }, 2000);
      },
      error: function (jqXHR, exception) {
        KTApp.unblock("#kt_modal_4");
        showEmployeeErrorMsg(form, "danger", jqXHR.responseJSON.errors);
        //$("#kt_modal_4").modal("toggle");
        //toastr.error(jqXHR.responseText);
      },
    });
  } else {
    $.ajax({
      type: "PUT",
      url: "/api/employee/" + employeeData.id,
      data: employeeData, // serializes the form's elements.
      success: function (data) {
        if (data.redirect) {
          return (window.location.href = data.redirect);
        }
        if (data.msg === "error") {
          return showEmployeeErrorMsg(form, "danger", data.errors);
        }

        $("#editEmployee").trigger("reset");
        $("#kt_quick_panel_toggler_btn").trigger("click");
        var table = $("#kt_table_3").DataTable();
        table.ajax.reload();
        KTApp.unblock("#kt_modal_4");
        $("#kt_modal_4").modal("toggle");
        toastr.success("Employee Edited");
      },
      error: function (jqXHR, exception) {
        var msg = "";
        KTApp.unblock("#kt_modal_4");
        //$("#kt_modal_4").modal("toggle");
        showEmployeeErrorMsg(form, "danger", jqXHR.responseJSON.errors);
        //toastr.error(jqXHR.responseText);
      },
    });
  }
};

const deleteEmployee = (id, rowindex) => {
  swal
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
    .then(function (result) {
      if (result.value) {
        $.ajax({
          type: "DELETE",
          url: `/api/employee/${id}`,
          success: function (data) {
            if (data.redirect) {
              return (window.location.href = data.redirect);
            }
            $("#kt_quick_panel_toggler_btn").trigger("click");
            swal.fire("Deleted!", "Your file has been deleted.", "success");
            var table = $("#kt_table_3").DataTable();
            //table.row(rowindex).data(data).draw();
            table.ajax.reload();
          },
          error: function (err) {
            var obj = JSON.parse(err.responseText);
            swal.fire("Error", obj.error.message, "error");
          },
        });

        // result.dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
      } else if (result.dismiss === "cancel") {
        swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
      }
    });
};

const editEmployee = (id, rowindex) => {
  form.clearForm();
  form.validate().resetForm();
  var data = [];
  data = $(`a[onclick="editEmployee('${id}')"]`)
    .closest("tr")
    .find("td")
    .each(function (key, val) {
      data.push(val);
    });
  $("#modalTitle")
    .empty()
    .append("Edit Employee" + id);
  $("#createEmployee #statusInput").show("fast");
  $.ajax({
    type: "GET",
    url: `/api/employee/${id}`,
    success: function (data) {
      let { name, phone, email, is_active, employee } = data.empinfo;
      $("#kt_modal_4 #email").val(email);
      $("#kt_modal_4 #name").val(name);
      $("#kt_modal_4 #phone").val(phone);
      $("#createEmployee #salary").val(employee.salary),
        $("#createEmployee #joiningDate").val(
          employee.joiningDate.split("T")[0]
        ),
        $("#createEmployee #user_role").val(employee.user_role),
        $("#kt_modal_4 #status").val(is_active ? "Active" : "In-Active");
    },
  });
  $("#actionButton")
    .attr(`onclick`, `createEmployee("${id}","${rowindex}")`)
    .empty()
    .append("Edit");
  // $('#editButton').attr(`onclick`,`createEmployee('${id}')`)
};

const clearForm = () => {
  $("#kt_modal_4").modal("toggle");
  form.clearForm();
  form.validate().resetForm();
  $("#createEmployee #statusInput").hide("fast");
  $("#actionButton")
    .attr(`onclick`, `createEmployee()`)
    .empty()
    .append("Create");
  $("#modalTitle").empty().append("Add Employee");
};

const toggleEmployeeCanvas = (id, rowindex) => {
  KTApp.block("#kt_quick_panel", {
    overlayColor: "#000",
    type: "v2",
    state: "success",
    message: "Please wait...",
  });
  $.ajax({
    type: "GET",
    url: `/api/employee/${id}`,
    success: function (data) {
      let { _id, name, phone, email, is_active, employee } = data.empinfo;
      $("#initialcharacter").empty().append(name.charAt(0));
      $("#kt-widget__title").empty().append(name);
      $("#kt-widget__desc").empty().append(email);
      $("#kt-widget__label_phone").empty().append(employee.user_role);
      $("#kt-widget__label_phone1").empty().append(phone);
      $("#kt-widget__subtitle_salary")
        .empty()
        .append(`&#8377;` + employee.salary);
      $("#kt-widget__subtitle_jDate")
        .empty()
        .append(datecovert(employee.joiningDate));
      $("#clientdetails").attr("href", `/su/employee/${_id}`);
    },
  });
  $("#kt_quick_panel_toggler_btn").trigger("click");
  KTApp.unblock("#kt_quick_panel");
  $("#editdetails").click(function () {
    editEmployee(id, rowindex);
  });
  $("#deleteclient").click(function () {
    deleteEmployee(id, rowindex);
  });
};

function datecovert(date) {
  var d = new Date(date);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var date = months[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
  return date;
}
