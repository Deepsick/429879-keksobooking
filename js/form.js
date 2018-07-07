'use strict';

(function () {

  var KEY_CODE_ESC = 27;
  var URL = 'https://js.dump.academy/keksobooking';

  var typeInput = document.querySelector('#type');
  var priceInput = document.querySelector('#price');
  var titleInput = document.querySelector('#title');

  var minPriceType = {
    'palace': 10000,
    'house': 5000,
    'flat': 1000,
    'bungalo': 0
  };

  /**
   * Устанавливаем минимальную цену за выбранный тип жилья
   */
  var setTypePrice = function () {
    var typeValue = minPriceType[typeInput.value];
    priceInput.min = typeValue;
    priceInput.placeholder = typeValue;
  };

  setTypePrice();

  typeInput.addEventListener('change', function () {
    setTypePrice();
  });


  var timeinInput = document.querySelector('#timein');
  var timeoutInput = document.querySelector('#timeout');

  timeinInput.addEventListener('change', function () {
    timeoutInput.value = timeinInput.value;
  });
  timeoutInput.addEventListener('change', function () {
    timeinInput.value = timeoutInput.value;
  });

  var roomNumberInput = document.querySelector('#room_number');
  var capacityInput = document.querySelector('#capacity');

  /**
   * Подсвечиваем неверно заполненное поле красной рамкой
   * @param  {Boolean} isHighlightted
   * @param  {Object}  input
   */
  var highlightInput = function (isHighlightted, input) {
    if (isHighlightted) {
      input.style.boxShadow = '0 0 1px 1px red';
    } else {
      input.style.boxShadow = 'none';
    }
  };

  /**
   * Проверяем синхронизацию количество выбранных гостей с количеством выбранных комнат
   */
  var checkCapacity = function () {
    if (roomNumberInput.value === '100' && capacityInput.value !== '0') {
      capacityInput.setCustomValidity('100 комнат не для гостей!');
    } else if (capacityInput.value === '0' && roomNumberInput.value !== '100') {
      capacityInput.setCustomValidity('Укажите количество гостей!');
    } else if (+roomNumberInput.value < +capacityInput.value) {
      capacityInput.setCustomValidity('Слишком много гостей для такого количества комнат!');
    } else {
      capacityInput.setCustomValidity('');
      highlightInput(false, capacityInput);
    }
  };

  capacityInput.addEventListener('invalid', function () {
    highlightInput(true, capacityInput);
  });

  priceInput.addEventListener('invalid', function () {
    highlightInput(true, priceInput);
  });

  priceInput.addEventListener('change', function () {
    if (priceInput.validity.valid) {
      highlightInput(false, priceInput);
    }
  });

  titleInput.addEventListener('invalid', function () {
    highlightInput(true, titleInput);
  });

  titleInput.addEventListener('change', function () {
    if (titleInput.validity.valid) {
      highlightInput(false, titleInput);
    }
  });

  checkCapacity();

  capacityInput.addEventListener('change', function () {
    checkCapacity();
  });

  roomNumberInput.addEventListener('change', function () {
    checkCapacity();
  });

  var avatarPreview = document.querySelector('.ad-form-header__preview img');
  var photoBlock = document.querySelector('.ad-form__photo');
  var defaultAvatar = avatarPreview.src;

  /**
   * Очищаем блоки с фотографиями
   */
  var resetPhotos = function () {
    avatarPreview.src = defaultAvatar;
    photoBlock.innerHTML = '';
  };

  var adForm = document.querySelector('.ad-form');
  var filtersForm = document.querySelector('.map__filters');
  var resetButton = document.querySelector('.ad-form__reset');
  var successPopup = document.querySelector('.success');
  resetButton.addEventListener('click', function () {
    adForm.reset();
    filtersForm.reset();
    setTypePrice();
    resetPhotos();
    window.map.activatePage(false);
    window.filter.resetFilterState();
    highlightInput(false, priceInput);
    highlightInput(false, titleInput);
    highlightInput(false, capacityInput);
  });

  /**
   * Прячем блок .success, если нажат esc или клик по экрану браузера
   * @param  {Object} evt
   */
  var successPopupPressHadler = function (evt) {
    if (evt.keyCode === KEY_CODE_ESC || evt.target === successPopup || evt.target.parentNode === successPopup) {
      successPopup.classList.add('hidden');
      document.removeEventListener('keydown', successPopupPressHadler);
      document.removeEventListener('click', successPopupPressHadler);
    }
  };

  /**
   * Возвращаем страницу в исходное состояние
   */
  var successHandler = function () {
    document.removeEventListener('keydown', successPopupPressHadler);
    document.removeEventListener('click', successPopupPressHadler);
    adForm.reset();
    filtersForm.reset();
    setTypePrice();
    checkCapacity();
    resetPhotos();
    window.map.activatePage(false);
    window.filter.resetFilterState();
    successPopup.classList.remove('hidden');
    document.addEventListener('keydown', successPopupPressHadler);
    document.addEventListener('click', successPopupPressHadler);
  };

  adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.postData(URL, new FormData(adForm), successHandler, window.utils.errorHandler);
  });
})();
