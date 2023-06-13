const getBulkTaskCreate = () => {
    $.ajax({
        url : "/api/task/get-bulk-task",
        method : "GET",
        success : (data) => {
            if (data.redirect) {
                return window.location.href = data.redirect
            }
            var taskCreated = ``
            data.map(el => {
                taskCreated += `<div class="kt-widget6__item"><span>${new Date(el.addedOn).toLocaleDateString()}</span><span>${el.taskIds.length}</span><span class="kt-font-success kt-font-bold">${el.filename}</span><span onclick="deleteBulkTasks('${el._id}')"><i class="flaticon-delete"></i></span></div>`
            })
            $("#getBulkCreatedTask").empty().append(taskCreated)
        },
        error : (error) => {
            toastr.error(error.responseText)
        }    
    })
}

const deleteBulkTasks = (id) => {
    swal
    .fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, delete!`,
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    })
    .then(function(result) {
        console.log(result.value)
        if (result.value) {
            $.ajax({
                url : "/api/task/delete-bulk/" + id,
                method : "DELETE",
                success : (data) => {
                    if (data.redirect) {
                        return window.location.href = data.redirect
                    }
                    getBulkTaskCreate()
                    toastr.success("Task deleted successfully")
                },
                error : (error) => {
                    toastr.error(error.responseText)
                }    
            })
        } else if (result.dismiss === "cancel") {
            swal.fire("Cancelled", `Bulk task deletion cancelled`, "error");
          }
    })
}

$(document).ready(() => {
    getBulkTaskCreate()
})