"use strict";

var linkForm = $("#createTask");
linkForm.validate({
  rules: {
    client: "required",
    currency: "required",
    amount: "required",
  },
  messages: {
    client: "client is required",
    currency: "currency is required",
    amount: "amount is required",
  },
});

var showRazorpayErrorMsg = function (form, type, msg) {
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

var clients = ``;
var KTDatatablesExtensionButtons = (function () {
  var initTable3 = function () {
    // begin first table
    var table = $("#kt_table_3").DataTable({
      dom: "brltip",
      //   dom: "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
      processing: true,
      ajax: {
        url: "/razorpay/getpaymentlink",
        type: "GET",
      },

      columns: [
        { data: "id" },
        { data: "created_at" },
        { data: "amount" },
        { data: "amount_paid" },
        { data: "status" },
        { data: "short_url" },
      ],
      columnDefs: [
        {
          targets: 1,
          render: function (data, type, full, meta) {
            // let d = new Date(data);
            // return (d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear());
            return datecovert(data);
          },
        },
        {
          targets: 2,
          render: function (data, type, full, meta) {
            var amount = data / 100;
            return `${full.currency_symbol}${amount}`;
          },
        },
        {
          targets: 3,
          render: function (data, type, full, meta) {
            var amount = data / 100;
            return `${full.currency_symbol}${amount}`;
          },
        },
        {
          targets: 4,
          render: function (data, type, full, meta) {
            var type = {
              issued: { title: "Issued", state: "warning" },
              paid: { title: "Paid", state: "success" },
              cancelled: { title: "Cancelled", state: "danger" },
              partially_paid: { title: "Partially Paid", state: "brand" },
            };
            return `<span class="kt-badge kt-badge--${type[data].state} kt-badge--dot"></span>&nbsp;<span class="kt-font-bold kt-font-${type[data].state}">${type[data].title}</span>`;
          },
        },
        {
          targets: 5,
          render: function (data, type, full, meta) {
            return `${data}`;
          },
        },
      ],
    });

    $("#export_print").on("click", function (e) {
      e.preventDefault();
      table.button(0).trigger();
    });

    $("#export_copy").on("click", function (e) {
      e.preventDefault();
      table.button(1).trigger();
    });

    $("#export_excel").on("click", function (e) {
      e.preventDefault();
      table.button(2).trigger();
    });

    $("#export_csv").on("click", function (e) {
      e.preventDefault();
      table.button(3).trigger();
    });

    $("#export_pdf").on("click", function (e) {
      e.preventDefault();
      table.button(4).trigger();
    });

    $("#kt_form_status").on("change", function () {
      console.log($(this).val());
      table.columns(5).search($(this).val()).draw();
    });

    $("#kt_form_status").selectpicker();

    $("#kt_datatable_reload").on("click", function () {
      table.ajax.reload();
    });

    $("#generalSearch").keyup(function () {
      table.search($(this).val()).draw();
    });
  };
  return {
    //main function to initiate the module
    init: function () {
      initTable3();
    },
  };
})();
function datecovert(timestamp) {
  var d = new Date(timestamp * 1000);
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
  var date = months[d.getMonth()] + " " + d.getDate() + "," + d.getFullYear();
  return date;
}
jQuery(document).ready(function () {
  $.ajax({
    type: "GET",
    url: "/api/client/view",
    success: function (responseData) {
      let { data } = responseData;
      clients += '<option value="">Select a Client</option>';
      for (var i = 0; i < data.length; i++) {
        clients +=
          '<option value="' + data[i]._id + '">' + data[i].name + "</option>";
      }
      $("#kt_select2_1").empty().append(clients);
    },
    error: function (err) {
      toastr.error("Error loading Clients");
    },
  });

  KTDatatablesExtensionButtons.init();
});
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
const myFunctionCopy = () => {
  var copyText = document.getElementById("razorpaylink");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  toastr.success("link copied");
};
$("#linkcreated").hide();

const clearCreateLinkForm = () => {
  $("#createTask").trigger("reset");
  $("#createTask").show();
  $("#linkcreated").hide();
  $("#actionButton").show();
};

const createLink = () => {
  var clientid = $("#kt_select2_1").val();
  var currency = $("#selectcurrency").val();
  var amount = $("#amountinput").val();
  var ppayment = $("#ppayment").val();
  var linkcreate = {
    clientid: clientid,
    currency: currency,
    amount: amount,
    ppayment: ppayment,
  };
  KTApp.block("#kt_modal_4", {
    overlayColor: "#000000",
    type: "v2",
    state: "success",
    message: "Please wait...",
  });
  $.ajax({
    type: "POST",
    data: linkcreate,
    url: "/razorpay/createcustomer",
    success: function (responseData) {
      if (responseData.redirect) {
        return (window.location.href = responseData.redirect);
      }
      $("#createTask").hide();
      $("#linkcreated").show();
      $("#actionButton").hide();
      KTApp.unblock("#kt_modal_4");
      $("#razorpaylink").val(responseData.short_url);
      var row = $("#kt_table_3")
        .DataTable()
        .row.add(responseData)
        .select()
        .draw()
        .node();
      setTimeout(function () {
        $("#kt_table_3").DataTable().row(row).deselect();
      }, 5000);
    },
    error: function (error) {
      KTApp.unblock("#kt_modal_4");
      showRazorpayErrorMsg(linkForm, "danger", error.responseJSON.errors);
    },
  });
};
