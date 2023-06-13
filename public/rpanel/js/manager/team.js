'use strict';

var KTTreeview = (function () {
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
  var demo6 = function () {
    $('#kt_tree_6').jstree({
      core: {
        themes: {
          responsive: false,
        },
        // so that create works
        check_callback: true,
        data: {
          url: function (node) {
            return '/manager/employee/tree';
          },
          data: function (node) {
            return {
              parent: node.id === '#' ? $('#treeViewCallId').text() : node.id,
            };
          },
          cache: false,
        },
      },
      types: {
        default: {
          icon: 'fa fa-folder kt-font-brand',
        },
        file: {
          icon: 'fa fa-file  kt-font-brand',
        },
      },
      state: { key: 'demo3' },
      plugins: ['dnd', 'state', 'types', 'contextmenu'],
      contextmenu: {
        items: function (node) {},
      },
    });
  };

  return {
    //main function to initiate the module
    init: function () {
      demo6();
    },
  };
})();

jQuery(document).ready(function () {
  KTTreeview.init();
  $('#assignRole').on('change', function () {
    $.ajax({
      method: 'GET',
      url: '/manager/employee/assignTo',
      data: {
        role: $(this).val(),
        id: $('#changeAssignUser').text(),
      },
      success: function (data) {
        $('#assignTo').removeAttr('disabled').empty();
        data.user.forEach((obj) => {
          $('#assignTo').append(
            `<option value="${obj._id}">${obj.name} [${obj.employee.user_role}]</option>`
          );
        });
      },
      error: function (jqXHR, exception) {
        toastr.err(jqXHR.responseText);
      },
    });
  });
});
