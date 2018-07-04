'use strict';

(function () {

  var fileChooser = document.querySelector('.ad-form__upload input[type=file]');
  var photoBlock = document.querySelector('.ad-form__photo');

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];

    if (file) {
      var fileName = file.name.toLowerCase();

      var matches = window.data.FILE_TYPES.some(function (it) {
        return fileName.endsWith(it);
      });

      if (matches) {
        var photo = document.createElement('img');
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          photo.src = reader.result;
          photoBlock.append(photo);
        });

        reader.readAsDataURL(file);
      }
    }
  });
})();
