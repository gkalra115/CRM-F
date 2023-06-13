"use strict";

var KTTreeview = (function () {
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
  var demo6 = function () {
    $("#kt_tree_6").jstree({
      core: {
        themes: {
          responsive: false,
        },
        // so that create works
        check_callback: true,
        data: {
          url: function (node) {
            return "/api/employee/tree";
          },
          data: function (node) {
            return {
              parent: node.id === "#" ? $("#treeViewCallId").text() : node.id,
            };
          },
          cache: false,
        },
      },
      types: {
        default: {
          icon: "fa fa-folder kt-font-brand",
        },
        file: {
          icon: "fa fa-file  kt-font-brand",
        },
      },
      state: { key: "demo3" },
      plugins: ["dnd", "state", "types", "contextmenu"],
      contextmenu: {
        items: function (node) {
          return {
            "Assign To": {
              seperator_before: false,
              seperator_after: false,
              label: "Assign To",
              action: function (obj) {
                $.ajax({
                  method: "POST",
                  url: "/api/employee/assignTo",
                  data: {
                    id: obj.reference[0].id.split("_")[0],
                  },
                  success: function (data) {
                    if (data.redirect) {
                      return (window.location.href = data.redirect);
                    }
                    $("#assignRoleInput").hide();
                    $("#assignRole").val("");
                    $("#assignTo").removeAttr("disabled");
                    $("#changeAssignUser")
                      .empty()
                      .append(obj.reference[0].id.split("_")[0]);
                    $("#assignTo").empty();
                    data.getAboveHierarchy.forEach((obj) => {
                      $("#assignTo").append(
                        `<option value="${obj._id}">${obj.name} [${obj.employee.user_role}]</option>`
                      );
                    });
                  },
                  error: function (jqXHR, exception) {
                    toastr.err(jqXHR.responseText);
                  },
                });
                $("#kt_modal_4").modal("toggle");
              },
            },
            Edit: {
              seperator_before: false,
              seperator_after: false,
              label: "Edit User",
              action: function (obj) {
                $.ajax({
                  method: "GET",
                  url: "/api/employee/" + obj.reference[0].id.split("_")[0],
                  success: function (data) {
                    $("#assignRoleInput").show();
                    $("#assignRole").val(data.employee.user_role);
                    $("#changeAssignUser")
                      .empty()
                      .append(obj.reference[0].id.split("_")[0]);
                    $("#assignTo").attr("disabled", "disabled");
                    $("#kt_modal_4").modal("toggle");
                  },
                  error: function (jqXHR, exception) {
                    toastr.err(jqXHR.responseText);
                  },
                });
              },
            },
            // "Assign Users To" : {
            //     "seperator_before" : true,
            //     "seperator_after" : false,
            //     "label" : "Assign Users To",
            //     action : function (obj) {
            //         // $.ajax({
            //         //     method : "GET",
            //         //     url : '/api/employee/' +  (obj.reference[0].id).split("_")[0],
            //         //     success : function(data){
            //         //         $("#assignRoleInput").show()
            //         //         $("#assignRole").val(data.employee.user_role)
            //         //         $("#changeAssignUser").empty().append((obj.reference[0].id).split("_")[0])
            //         //         $("#assignTo").attr("disabled", "disabled")
            //         //         $("#kt_modal_4").modal("toggle");

            //         //     },
            //         //     error : function(jqXHR, exception){
            //         //         toastr.err(jqXHR.responseText);
            //         //     }
            //         // })
            //     }
            // },
          };
        },
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

const assignTo = () => {
  $.ajax({
    method: "PUT",
    url: "/api/employee/assignTo",
    data: {
      userId: $("#changeAssignUser").text(),
      assignToId: $("#assignTo").val(),
      assignNewRole: $("#assignRole").val(),
    },
    success: function (data) {
      if (data.redirect) {
        return (window.location.href = data.redirect);
      }
      if (data.result === "OK") {
        $("#clearModal").trigger("click");
        $("#kt_tree_6").jstree(true).refresh();
        toastr.success(data.msg);
      } else {
        toastr.success(data.msg);
      }
    },
    error: function (jqXHR, exception) {
      toastr.err(jqXHR.responseText);
    },
  });
};

jQuery(document).ready(function () {
  KTTreeview.init();
  $("#assignRole").on("change", function () {
    $.ajax({
      method: "GET",
      url: "/api/employee/assignTo",
      data: {
        role: $(this).val(),
        id: $("#changeAssignUser").text(),
      },
      success: function (data) {
        $("#assignTo").removeAttr("disabled").empty();
        data.user.forEach((obj) => {
          $("#assignTo").append(
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
