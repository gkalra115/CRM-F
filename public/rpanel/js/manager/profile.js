$.ajax({
  type: 'GET',
  url: '/manager/employee/stats',
  success: function (data) {
    $('#totalwordcount').text(data[0].totalAmount);
    $('#totaltask').text(data[0].count);
    $('#totalwordcountcount').text(data[0].totalAmount);
    $('#totaltaskcount').text(data[0].count);
  },
});

$.ajax({
  type: 'GET',
  url: '/manager/employee/profile',
  success: function (data) {
    $('#expertname').text(data.name);
    $('#expertdesignation').text(data.employee.user_role);
    $('#expertemail').text(data.email);
    $('#expertphone').text(data.phone);
    $('#joiningdate').text(convertTableDate(data.employee.joiningDate));
    $('#teamlead').text(data.assignedTo.name);
  },
});

$('#personalinfo').click(function () {
  $('#personallink').addClass('kt-nav__item--active');
  $('#statlink').removeClass('kt-nav__item--active');
  $('#statsexpert').hide();
  $('#userdetails').show();
  document.documentElement.scrollTop = 0;
});

$('#statsinfo').click(function () {
  $('#statlink').addClass('kt-nav__item--active');
  $('#personallink').removeClass('kt-nav__item--active');
  $('#userdetails').hide();
  $('#statsexpert').show();
  document.documentElement.scrollTop = 0;
});

const convertTableDate = (date) => {
  var months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let current_datetime = new Date(date);
  var formatted_date =
    current_datetime.getDate() +
    ' ' +
    months[current_datetime.getMonth()] +
    ' ' +
    current_datetime.getFullYear();
  return formatted_date;
};

$('#accountdetailportlet').hide();
$('#psswordchangeportlet').hide();

var ManagerAccountForm = $('#mn-account-form');
var ManagerChangePasswordForm = $('#mn-change-password');

ManagerChangePasswordForm.validate({
  rules: {
    oldPassword: {
      required: true,
      minlength: 8,
    },
    newPassword: {
      required: true,
      minlength: 8,
    },
    confirmPassword: {
      required: true,
      minlength: 8,
      equalTo: '#newPassword',
    },
  },
  messages: {
    oldPassword: {
      required: 'old password is required',
      minlength: 'Minimum 8 characters of password required',
    },
    newPassword: {
      required: 'new password is required',
      minlength: 'Minimum 8 characters of password required',
    },
    confirmPassword: {
      required: 'confirm password is required',
      minlength: 'Minimum 8 characters of password required',
      equalTo: 'Please enter same value as new password',
    },
  },
});

ManagerAccountForm.validate({
  rules: {
    accountNumber: {
      required: true,
      isnum: true,
    },
    holderName: {
      required: true,
      isname: true,
    },
    bank: 'required',
    ifsc: 'required',
  },
  messages: {
    accountNumber: {
      required: 'Account number is required',
      isnum: 'Account no. should be a number',
    },
    holderName: {
      required: 'Holder name is required',
      isname: 'Holder name should be valid',
    },
    bank: {
      required: 'Bank is required',
    },
    ifsc: {
      required: 'IFSC code is required',
    },
  },
});

jQuery.validator.addMethod('isnum', (value, element) => {
  return !isNaN(value);
});

jQuery.validator.addMethod('isname', (value, element) => {
  return /^[a-zA-Z ]{2,50}$/.test(value);
});

$('#accountdetailportlet').hide();
$('#psswordchangeportlet').hide();
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
$.ajax({
  type: 'GET',
  url: '/manager/task/stats',
  success: function (data) {
    if (data.length > 0) {
      $('#totaltask').text(data[0].count + ' Tasks');

      $('#totalwordcountcount').text(data[0].totalAmount);
      $('#totaltaskcount').text(data[0].count);
    }
  },
});

$.ajax({
  type: 'GET',
  url: '/manager/employee/profile',
  success: function (data) {
    $('#empname').text(data.name);
    $('#joiningdate')
      .empty()
      .append(
        '<i class="flaticon2-calendar"></i>' +
          convertTableDate(data.employee.joiningDate)
      );
    $('#expertdesignation')
      .empty()
      .append('<i class="flaticon2-calendar-3"></i>' + data.employee.user_role);
    $('#expertemail')
      .empty()
      .append('<i class="flaticon2-new-email"></i>' + data.email);
    $('#expertphone')
      .empty()
      .append('<i class="flaticon2-phone"></i>' + data.phone);
    var name = data.name;
    var initials = name.match(/\b\w/g) || [];
    initials = (
      (initials.shift() || '') + (initials.pop() || '')
    ).toUpperCase();
    $('#empnameinitials').text(initials);
  },
});

$('#viewaccount').click(function () {
  $('#accountdetailportlet').fadeIn();
  $('#psswordchangeportlet').hide();

  // $("#submitaccountdetails").click(function(){
  //   findMember($('.ifsccodehere').val())
  // })

  $('#submitaccountdetails').click(function () {
    $.ajax({
      type: 'GET',
      url: 'https://ifsc.razorpay.com/' + $('.ifsccodehere').val(),
      success: function (data) {
        $('#bankverification')
          .empty()
          .append(
            '<span class="form-text text-muted">' + data.BRANCH + '</span>'
          );

        var data = {
          accountNumber: $('.accountnumber').val(),
          ifsc: $('.ifsccodehere').val(),
          accountHolder: $('.accholdername').val(),
          bank: $('.getteam option[value=' + $('.getteam').val() + ']').text(),
        };
        KTApp.blockPage({
          overlayColor: '#000000',
          type: 'v2',
          state: 'primary',
          message: 'Processing...',
        });
        $.ajax({
          type: 'POST',
          url: '/api/userAccountInfo/create',
          data: data,
          success: function (data) {
            KTApp.unblockPage();
            toastr.success(data.message);
          },
        });
      },
      error: function (error) {
        $('#bankverification')
          .empty()
          .append(
            '<span class="form-text text-danger" style="color:red;">Please enter valid IFSC code</span>'
          );
      },
    });
  });
});

var timeoutID = null;

function findMember(str) {
  $.ajax({
    type: 'GET',
    url: 'https://ifsc.razorpay.com/' + str,
    success: function (data) {
      $('#bankverification')
        .empty()
        .append(
          '<span class="form-text text-muted">' + data.BRANCH + '</span>'
        );
    },
    error: function (error) {
      $('#bankverification')
        .empty()
        .append(
          '<span class="form-text text-danger" style="color:red;">Please enter valid IFSC code</span>'
        );
    },
  });
}

$('.ifsccodehere').keyup(function (e) {
  clearTimeout(timeoutID);
  //timeoutID = setTimeout(findMember.bind(undefined, e.target.value), 500);
  timeoutID = setTimeout(() => findMember(e.target.value), 500);
});

$('#changepassword').click(function () {
  $('#psswordchangeportlet').fadeIn();
  $('#accountdetailportlet').hide();
  $('#updatepasswordchange').click(function () {
    var data = {
      oldPassword: $('.old_passcode').val(),
      newPassword: $('.new_passcode').val(),
      confirmPassword: $('.confirm_passcode').val(),
    };
    KTApp.blockPage({
      overlayColor: '#000000',
      type: 'v2',
      state: 'primary',
      message: 'Processing...',
    });
    $.ajax({
      type: 'PUT',
      url: '/change-password',
      data: data,
      success: function (data) {
        KTApp.unblockPage();
        toastr.success(data.msg);
      },
      error: function (error) {
        KTApp.unblockPage();
        $('#errormessagepassword')
          .empty()
          .append(
            '<div class="alert alert-danger" role="alert"><div class="alert-text"><h4 class="alert-heading">Got Issues!</h4><p>' +
              error.responseJSON.error +
              '</p></div></div>'
          );
      },
    });
  });
});

$('#closeaccountportlet').click(function () {
  $('#accountdetailportlet').fadeOut();
});

$('#closepasswordportlet').click(function () {
  $('#psswordchangeportlet').fadeOut();
});

function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType('application/json');
  rawFile.open('GET', file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == '200') {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
}

//usage:
readTextFile('/rpanel/banknames.json', function (text) {
  var responseData = JSON.parse(text);
  let teamDropdown = `<option value ="">Select an bank</option>`;
  for (const key in responseData) {
    teamDropdown += `<option value="${key}">${responseData[key]}</option>`;
  }
  $('.getteam').empty().append(teamDropdown);
  $('select.getteam').change(function () {
    var selectedCountry = $(this).children('option:selected').val();
    $('.ifsccodehere').empty().val(selectedCountry);
  });
});

$.ajax({
  type: 'GET',
  url: '/api/userAccountInfo/',
  success: function (data) {
    if (data[0]) {
      var bankname = data[0].IFSC.substring(0, 4);
      $('.accountnumber').empty().val(data[0].accountNumber);
      $('#kt_select2_1').val(bankname).trigger('change');
      $('.ifsccodehere').empty().val(data[0].IFSC);
      $('.accholdername').empty().val(data[0].accountHolder);
    } else {
      $('#alertforaccount').append(
        '<div class="alert alert-danger" role="alert"><div class="alert-text">Please enter your account details</div></div>'
      );
    }
  },
  error: function (error) {
    console.log(error);
  },
});
