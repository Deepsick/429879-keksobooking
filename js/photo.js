'use strict';

(function () {

  var PHOTO_WIDTH = 100;
  var PHOTO_HEIGHT = 100;

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
          photo.width = PHOTO_WIDTH;
          photo.height = PHOTO_HEIGHT;
          photoBlock.append(photo);
        });

        reader.readAsDataURL(file);
      }
    }
  });
})();
