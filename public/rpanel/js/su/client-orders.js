const get_table = ($table) => {
  let table = $table.DataTable();
  return table;
};

const validate_task_create = () => {
  const form = $('#createTask');
  form.validate({
    rules: {
      wordcount: {
        required: true,
      },
      softdeadline: {
        required: true,
        softdeadline_validation: true,
      },
      harddeadline: {
        required: true,
        harddeadline_validation: true,
      },
    },
    messages: {
      wordcount: {
        required: 'wordcount is required',
      },
      soft_deadline: 'softdeadline is required',
      hard_deadline: 'harddeadline is required',
    },
  });

  jQuery.validator.addMethod(
    'softdeadline_validation',
    (value, element) => {
      return value.length > 0;
    },
    'softdeadline is required'
  );

  jQuery.validator.addMethod(
    'harddeadline_validation',
    (value, element) => {
      return value.length > 0;
    },
    'harddeadline is required'
  );
};

const on_accept_order = (rowNum, id) => {
  const table = get_table($('#kt_table_3'));
  const rowData = table.row(rowNum).data();
  const $form = $('#createTask');
  $('#taskFiles').empty().append(`<h5>Brief Files</h5>`);
  console.log(rowData.orderFiles);
  if (rowData.orderFiles.length > 0) {
    rowData.orderFiles.map((e) => {
      $('#taskFiles').append(`
      <a href="${e.uploadpath}">
        <span class="kt-badge kt-badge--brand kt-badge--inline">
          ${e.files}
        </span>
      </a>`);
    });
  } else {
    $('#taskFiles').append(
      `<p>There's no brief files attached for this order</p>`
    );
  }
  $form.find('#title').val(rowData.title);
  $form.find('#wordcount').val(rowData.wordcount);
  $form.find('#harddeadline').val(rowData.hard_deadline.split('T')[0]);
  $('#textdescription').summernote('code', rowData.description);
  $('#actionButton').attr(
    'onclick',
    `on_accept_order_request('${id}', '${rowData.client._id}')`
  );
};

const clear_form = ($form) => {
  $form.trigger('reset');
  $form.trigger('clear');
  $('.summernote').summernote('code', '');
};

const showTaskErrorMsg = (form, type, msg) => {
  KTApp.unblock('#kt_modal_7');
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
  form.find('.alert').remove();
  alert.prependTo(form);
  //alert.animateClass('fadeIn animated');
  KTUtil.animateClass(alert[0], 'fadeIn animated');
  alert.find('span').html(msg);
};

const on_accept_order_request = (orderId, clientId) => {
  const table = get_table($('#kt_table_3'));
  const $form = $('#createTask');
  if (!$form.valid()) {
    return;
  }
  if (
    !(
      new Date($form.find('#softdeadline').val()).valueOf() <=
      new Date($form.find('#harddeadline').val()).valueOf()
    )
  ) {
    toastr.warning('Soft Deadline should not be greater then Hard Deadline');
    return;
  }
  let taskData = get_form_data($form);
  taskData = {
    ...taskData,
    description: $('#textdescription').summernote('code'),
    orderId,
  };
  let reqData = [
    {
      title: taskData.title,
      client: clientId,
    },
  ];
  delete taskData.title;
  KTApp.block('#kt_modal_7', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  $.ajax({
    type: 'POST',
    url: '/api/task/create',
    data: {
      data: JSON.stringify({
        taskDetail: taskData,
        clientData: reqData,
      }),
    },
    success: function (data) {
      if (data.redirect) {
        return (window.location.href = data.redirect);
      }
      if (data.msg === 'error') {
        return showTaskErrorMsg($form, 'danger', data.errors);
      }
      KTApp.unblock('#kt_modal_7');
      $('#kt_modal_7').modal('toggle');
      toastr.success('Task Added');
      table.ajax.reload();
      clear_form($form);
      if (data.task.length === 1) {
        window.open(`/su/task/${data.task[0]._id}`, '_blank');
      }
    },
    error: function (err) {
      KTApp.unblock('#kt_modal_7');
      $('#kt_modal_7').modal('toggle');
      toastr.error(err.responseJSON.error);
    },
  });
};

function get_form_data($form) {
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function (n, i) {
    indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}

const init_summernote = () => {
  $('.summernote').summernote({
    toolbar: [
      // [groupName, [list of button]]
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['strikethrough', 'superscript', 'subscript']],
      ['fontsize', ['fontsize']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['height', ['height']],
    ],
  });
};

const reject_order_request = (rowNum) => {
  const table = get_table($('#kt_table_3'));
  const rowData = table.row(rowNum).data();
  swal
    .fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, reject it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    })
    .then(function (result) {
      if (result.value) {
        $.ajax({
          type: 'PUT',
          url: `/api/order/reject/${rowData._id}`,
          success: function (data) {
            if (data.redirect) {
              return (window.location.href = data.redirect);
            }
            swal.fire('Rejected!', 'The order has been rejected.', 'success');
            table.ajax.reload();
          },
          error: function (err) {
            var obj = JSON.parse(err.responseText);
            swal.fire('Error', obj.error.message, 'error');
          },
        });

        // result.dismiss can be 'cancel', 'overlay',
        // 'close', and 'timer'
      } else if (result.dismiss === 'cancel') {
        swal.fire('Operation Cancelled', 'Your order is safe :)', 'error');
      }
    });
};

$(document).ready(function () {
  init_summernote();
  validate_task_create();
});
