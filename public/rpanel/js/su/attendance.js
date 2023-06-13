// var form = $("#createEmployee");
// form.validate({
//   rules: {
//     email: {
//       required: true,
//       email: true,
//     },
//     name: {
//       required: true,
//     },
//     phone: {
//       required: true,
//       number: true,
//     },
//     salary: {
//       required: true,
//       number: true,
//     },
//     university: {
//       required: true,
//     },
//     joiningDate: {
//       required: true,
//     },
//     user_role: {
//       required: true,
//     },
//     statusInput: {
//       required: true,
//     },
//   },
// });

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

const get_table = ($table) => {
  let table = $table.DataTable();
  return table;
};

const toggleEmployeeCanvas = (rowindex) => {
  KTApp.block("#kt_quick_panel", {
    overlayColor: "#000",
    type: "v2",
    state: "success",
    message: "Please wait...",
  });
  const tableData = get_table($('#kt_table_3'));
  let row = tableData.row(rowindex).data();
  //let { _id, name, phone, email, is_active, employee } = data;
  if (!!row) {
    let { _id, name, email, phone, employee } = row.employeeId;
    $("#initialcharacter").empty().append(name.charAt(0));
    $("#kt-widget__title").empty().append(name);
    $("#kt-widget__desc").empty().append(email);
    $("#kt-widget__label_phone").empty().append(employee.user_role);
    $("#kt-widget__label_phone1").empty().append(phone);
    $("#clientdetails").attr("href", `/su/employee/${_id}`);
    $('#attendanceList').empty();
    if (row.timings.length > 0) {
      row.timings.map(e => {
        $('#attendanceList').prepend(`<div class="kt-widget5__item py-2"><div class="kt-widget5__content"><div class="kt-widget5__section"><span class="kt-widget5__title" style="font-size:1.3rem;pointer-events:none">${e.isInTime ? 'In-Time' : 'Out-Time'}</span></div></div><div class="kt-widget__action"><span class="btn btn-label-${e.isInTime ? 'success' : 'danger'} btn-sm btn-bold btn-upper">${formatAMPM(e.time)}</span></div></div>`);
      });
    } else {
      $('#attendanceList').append(`<h3>No scans done today.</h3>`);
    }

    $("#kt_quick_panel_toggler_btn").trigger("click");
    KTApp.unblock("#kt_quick_panel");
  }
  // $("#editdetails").click(function () {
  //   editEmployee(id, rowindex);
  // });
  // $("#deleteclient").click(function () {
  //   deleteEmployee(id, rowindex);
  // });
};

const init_time_picker = () => {
  $('.kt_timepicker').timepicker({
    minuteStep: 1,
    defaultTime: '',
    showSeconds: true,
    showMeridian: false,
    snapToStep: true
  });
};
const init_repeater = () => {
  $('#kt_repeater_1').repeater({
    initEmpty: false,

    defaultValues: {
      'text-input': 'foo'
    },

    show: function () {
      $(this).slideDown();
      console.log($(this).val());
    },

    hide: function (deleteElement) {
      $(this).slideUp(deleteElement);
    }
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

function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice(1);  // Remove full string match value
    //time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
    time[0] = time[0] % 12 || 12; // Adjust hours
    //console.log(time[0],time.join(' '));
  }
  return time.join(''); // return adjusted time or original string
}

function timeShorter(time) {
  let d = new Date(time);
  let sec = String(d.getUTCSeconds()).length <= 1 ? '0' + d.getUTCSeconds() : d.getUTCSeconds();
  let min = String(d.getUTCMinutes()).length <= 1 ? '0' + d.getUTCMinutes() : d.getUTCMinutes();
  let hr = String(d.getUTCHours()).length <= 1 ? '0' + d.getUTCHours() : d.getUTCHours();
  return hr + ":" + min + ":" + sec; //show , ye end me string hi return ho rhi h baki sabma bhi kru aur prepend se nicha chala gaya vo disabled vala // try
}



jQuery(document).ready(function () {
});

