'use strict';

(function () {

  var KEY_CODE_ESC = 27;

  var typeInput = document.querySelector('#type');
  var priceInput = document.querySelector('#price');

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
    }
  };

  checkCapacity();

  capacityInput.addEventListener('change', function () {
    checkCapacity();
  });

  roomNumberInput.addEventListener('change', function () {
    checkCapacity();
  });

  var adForm = document.querySelector('.ad-form');
  var resetButton = document.querySelector('.ad-form__reset');
  var successPopup = document.querySelector('.success');
  resetButton.addEventListener('click', function () {
    adForm.reset();
    setTypePrice();
    window.map.activatePage(false);
  });

  var successPopupPressHadler = function (evt) {
    if (evt.keyCode === KEY_CODE_ESC || evt.target === successPopup || evt.target.parentNode === successPopup) {
      successPopup.classList.add('hidden');
      document.removeEventListener('keydown', successPopupPressHadler);
      document.removeEventListener('click', successPopupPressHadler);
    }
  };
  /**
   * Возвращаем форму в исходное состояние
   */
  var successHandler = function () {
    adForm.reset();
    setTypePrice();
    window.map.activatePage(false);
    successPopup.classList.remove('hidden');
    document.addEventListener('keydown', successPopupPressHadler);
    document.addEventListener('click', successPopupPressHadler);
  };

  adForm.addEventListener('submit', function (evt) {
    var url = 'https://js.dump.academy/keksobooking';
    window.backend.postData(url, new FormData(adForm), successHandler, window.utils.errorHandler);
    evt.preventDefault();
  });
})();
