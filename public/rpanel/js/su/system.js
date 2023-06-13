const getLocation = () => {
  if (navigator.geolocation) {
    KTApp.block('#geoLocation', {
      overlayColor: '#000000',
      type: 'v2',
      state: 'success',
      message: 'Please wait...',
    });
    navigator.geolocation.getCurrentPosition(showPosition);

  } else {
    alert("Geolocation is not supported by this browser.");
  }
};

const showPosition = (position) => {
  const $form = $('#geoLocation');
  $form.find('input[name="latitude"]').val(position.coords.latitude);
  $form.find('input[name="longitude"]').val(position.coords.longitude);
  KTApp.unblock('#geoLocation');
};

const submitGeoLocation = () => {
  KTApp.block('#geoLocation', {
    overlayColor: '#000000',
    type: 'v2',
    state: 'success',
    message: 'Please wait...',
  });
  const $form = $('#geoLocation');
  $.ajax({
    method: 'PUT',
    data: {
      latitude: $form.find('input[name="latitude"]').val(),
      longitude: $form.find('input[name="longitude"]').val()
    },
    url: '/api/system/geolocation',
    success: function ({ status, msg, error }) {
      if (!!status && status === 'OK') {
        toastr.success(msg);
      } else {
        toastr.error(error);
      }
      KTApp.unblock('#geoLocation');
    },
    error: function (error) {
      console.log(error);
      toastr.error(error.responseJSON.error);
    }
  });
  $form.find('input[name="latitude"]').val('');
  $form.find('input[name="longitude"]').val('');
  KTApp.unblock('#geoLocation');
};