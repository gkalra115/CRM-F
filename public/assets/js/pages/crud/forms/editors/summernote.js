"use strict";
// Class definition

var KTSummernoteDemo = (function () {
  // Private functions
  var demos = function () {
    $(".summernote").summernote({
      height: 150,
    });
    $(".note-editable").attr("name", "description");
  };

  return {
    // public functions
    init: function () {
      demos();
    },
  };
})();

// Initialization
jQuery(document).ready(function () {
  KTSummernoteDemo.init();
});
