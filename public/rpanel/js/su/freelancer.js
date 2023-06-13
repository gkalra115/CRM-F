const createFreelancer = (id = undefined) => {
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
    KTApp.block("#kt_modal_4", {
      overlayColor: "#000000",
      type: "v2",
      state: "success",
      message: "Please wait..."
    });
    var freelancerData = {
      id: id,
      email: $("#createFreelancer #email").val(),
      name: $("#createFreelancer #name").val(),
      phone: $("#createFreelancer #phone").val(),
      is_active: $("#createFreelancer #status").val() === "Active" ? true : false
    }
    
    if (id === undefined) {
      $.ajax({
        type: "POST",
        url: "/api/freelancer/create",
        data: freelancerData, // serializes the form's elements.
        success: function(data) {
          setTimeout(function() {
            $("#createFreelancer").trigger("reset");
            if ($.fn.DataTable.isDataTable("#kt_table_3")) {
              $("#kt_table_3")
                .DataTable()
                .destroy();
            }
            $("#kt_table_3 tbody").empty();
            KTDatatablesExtensionButtons.init();
            KTApp.unblock("#kt_modal_4");
            $("#kt_modal_4").modal("toggle");
            toastr.success("New Freelancer Added");
          }, 2000);
        },
        error: function(jqXHR, exception) {
          KTApp.unblock("#kt_modal_4");
          $("#kt_modal_4").modal("toggle");
          toastr.error(jqXHR.responseText);
        }
      });
    } else {
      $.ajax({
        type: "PUT",
        url: "/api/freelancer/" + freelancerData.id,
        data: freelancerData, // serializes the form's elements.
        success: function(data) {
          setTimeout(function() {
            $("#editFreelancer").trigger("reset");
            if ($.fn.DataTable.isDataTable("#kt_table_3")) {
              $("#kt_table_3")
                .DataTable()
                .destroy();
            }
            $("#kt_table_3 tbody").empty();
            KTDatatablesExtensionButtons.init();
            KTApp.unblock("#kt_modal_4");
            $("#kt_modal_4").modal("toggle");
            toastr.success("Freelancer Edited");
          }, 2000);
        },
        error: function(jqXHR, exception) {
          var msg = "";
          KTApp.unblock("#kt_modal_4");
          $("#kt_modal_4").modal("toggle");
  
          toastr.error(jqXHR.responseText);
        }
      });
    }
  };
  
  const deleteFreelancer = (id) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true
      })
      .then(function(result) {
        if (result.value) {
          $.ajax({
            type: "DELETE",
            url: `/api/freelancer/${id}`,
            success: function(data) {
              swal.fire("Deleted!", "Your file has been deleted.", "success");
              if ($.fn.DataTable.isDataTable("#kt_table_3")) {
                $("#kt_table_3")
                  .DataTable()
                  .destroy();
              }
              $("#kt_table_3 tbody").empty();
              KTDatatablesExtensionButtons.init();
            },
            error: function(err) {
              var obj = JSON.parse(err.responseText);
              swal.fire("Error", obj.error.message, "error");
            }
          });
  
          // result.dismiss can be 'cancel', 'overlay',
          // 'close', and 'timer'
        } else if (result.dismiss === "cancel") {
          swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
        }
      });
  };
  
  const editFreelancer = id => {
    $("#createFreelancer").trigger("reset");
    var data = [];
    data = $(`a[onclick="editFreelancer('${id}')"]`)
      .closest("tr")
      .find("td")
      .each(function(key, val) {
        data.push(val);
      });
    $("#modalTitle")
      .empty()
      .append("Edit Freelancer" + id);
    $("#createFreelancer #statusInput").show("fast");
    $("#actionButton")
      .attr(`onclick`, `createFreelancer("${id}")`)
      .empty()
      .append("Edit");
    // $('#editButton').attr(`onclick`,`createFreelancer('${id}')`)
    $("#kt_modal_4 #email").val(data[0].innerHTML);
    $("#kt_modal_4 #name").val(data[1].innerHTML);
    $("#kt_modal_4 #phone").val(data[2].innerHTML);
    $("#kt_modal_4 #status").val(
      data[3].getElementsByTagName("span").item(1).innerHTML
    );
  };
  
  const clearForm = () => {
    $("#kt_modal_4").modal("toggle");
    $("#createFreelancer").trigger("reset");
    $("#createFreelancer #statusInput").hide("fast");
    $("#actionButton")
      .attr(`onclick`, `createFreelancer()`)
      .empty()
      .append("Create");
    $("#modalTitle")
      .empty()
      .append("Add Freelancer");
  };
  
  
  const toggleFreelancerCanvas = (id) => {
    KTApp.block("#kt_quick_panel", {
      overlayColor: "#000",
      type: "v2",
      state: "success",
      message: "Please wait...",
    });
    $.ajax({
      type : "GET",
      url : `/api/freelancer/${id}`,
      success : function(data){
        let { name, phone, email, is_active} = data
        $("#kt-widget__title").empty().append(name)
        $("#kt-widget__desc").empty().append(email)
        $("#kt-widget__label_status").empty().append((is_active ? `<span class="btn btn-label-success btn-sm btn-bold btn-upper">Active</span>` : `<span class="btn btn-label-success btn-sm btn-bold btn-upper">In-Active</span>`))
        $("#kt-widget__label_phone").empty().append(phone)
      }
    })
    $("#kt_quick_panel_toggler_btn").trigger("click")
    setTimeout(function() {
      KTApp.unblock("#kt_quick_panel");
    }, 2000) 
  }