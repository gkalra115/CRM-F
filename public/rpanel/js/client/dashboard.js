const init_dropzone = () => {
  // set the dropzone container id
  const id = '#kt_dropzone_4';

  // set the preview element template
  var previewNode = $(id + ' .dropzone-item');
  previewNode.id = '';
  var previewTemplate = previewNode.parent('.dropzone-items').html();
  previewNode.remove();

  var myDropzone4 = new Dropzone(id, {
    // Make the whole body a dropzone
    url: 'https://keenthemes.com/scripts/void.php', // Set the url for your upload script location
    parallelUploads: 20,
    previewTemplate: previewTemplate,
    maxFilesize: 1, // Max filesize in MB
    autoQueue: false, // Make sure the files aren't queued until manually added
    previewsContainer: id + ' .dropzone-items', // Define the container to display the previews
    clickable: id + ' .dropzone-select', // Define the element that should be used as click trigger to select files.
  });

  myDropzone4.on('addedfile', function (file) {
    // Hookup the start button
    file.previewElement.querySelector(
      id + ' .dropzone-start'
    ).onclick = function () {
      myDropzone4.enqueueFile(file);
    };
    $(document)
      .find(id + ' .dropzone-item')
      .css('display', '');
    $(id + ' .dropzone-upload, ' + id + ' .dropzone-remove-all').css(
      'display',
      'inline-block'
    );
  });

  // Update the total progress bar
  myDropzone4.on('totaluploadprogress', function (progress) {
    $(this)
      .find(id + ' .progress-bar')
      .css('width', progress + '%');
  });

  // myDropzone4.on('sending', function (file) {
  //   // Show the total progress bar when upload starts
  //   $(id + ' .progress-bar').css('opacity', '1');
  //   // And disable the start button
  //   file.previewElement
  //     .querySelector(id + ' .dropzone-start')
  //     .setAttribute('disabled', 'disabled');
  // });

  // Hide the total progress bar when nothing's uploading anymore
  myDropzone4.on('complete', function (progress) {
    var thisProgressBar = id + ' .dz-complete';
    setTimeout(function () {
      $(
        thisProgressBar +
          ' .progress-bar, ' +
          thisProgressBar +
          ' .progress, ' +
          thisProgressBar +
          ' .dropzone-start'
      ).css('opacity', '0');
    }, 300);
  });

  // Setup the buttons for all transfers
  // document.querySelector(id + ' .dropzone-upload').onclick = function () {
  //   myDropzone4.enqueueFiles(myDropzone4.getFilesWithStatus(Dropzone.ADDED));
  // };

  // Setup the button for remove all files
  document.querySelector(id + ' .dropzone-remove-all').onclick = function () {
    $(id + ' .dropzone-upload, ' + id + ' .dropzone-remove-all').css(
      'display',
      'none'
    );
    myDropzone4.removeAllFiles(true);
  };

  // On all files completed upload
  myDropzone4.on('queuecomplete', function (progress) {
    $(id + ' .dropzone-upload').css('display', 'none');
  });

  // On all files removed
  myDropzone4.on('removedfile', function (file) {
    if (myDropzone4.files.length < 1) {
      $(id + ' .dropzone-upload, ' + id + ' .dropzone-remove-all').css(
        'display',
        'none'
      );
    }
  });
};

const get_table = ($table) => {
  let table = $table.DataTable();
  return table;
};

const clear_form = ($form) => {
  $form.trigger('reset');
  $form.trigger('clear');
  $('.summernote').summernote('code', '');
  Dropzone.forElement('#kt_dropzone_4').removeAllFiles(true);
};

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

function get_form_data($form) {
  var unindexed_array = $form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function (n, i) {
    indexed_array[n['name']] = n['value'];
  });

  return indexed_array;
}

const upload_order_files = ($form, id) => {
  const table = get_table($('kt_table_4'));
  const formData = new FormData();
  var files = $('#kt_dropzone_4').get(0).dropzone.getAcceptedFiles();
  for (let x = 0; x < files.length; x++) {
    formData.append('files', files[x]);
  }
  $.ajax({
    url: '/client/task/order/files/' + id,
    method: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    cache: false,
    success: function (data) {
      $('#kt_modal_7').modal('toggle');
      clear_form($form);
      KTApp.unblock('#kt_modal_7');
      toastr.success(data.msg);
      table.ajax.reload();
    },
    error: function (error) {
      KTApp.unblock('#kt_modal_7');
      console.log(error.responseJSON.error);
      toastr.error(error.responseJSON.error);
    },
  });
};

const create_order = () => {
  KTApp.block('#kt_modal_7', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  var files = $('#kt_dropzone_4').get(0).dropzone.getAcceptedFiles();
  if (files.length === 0) {
    toastr.warning('Please select a file to upload');
    return;
  }
  const $form = $('#createOrder');
  const getFormData = new get_form_data($form);
  getFormData['description'] = $('#textdescription').summernote('code');
  $.ajax({
    url: '/client/task/order',
    method: 'POST',
    data: getFormData,
    success: function (data) {
      if (data.status === 'OK') {
        upload_order_files($form, data.id);
      } else {
        if (data.msg === 'error') {
          KTApp.unblock('#kt_modal_7');
          return showTaskErrorMsg(form, 'danger', data.errors);
        }
      }
    },
    error: function (error) {
      KTApp.unblock('#kt_modal_7');
      console.log(error.responseJSON.error);
      toastr.error(error.responseJSON.error);
    },
  });
};

$(document).ready(function () {
  init_dropzone();
  init_summernote();
});
