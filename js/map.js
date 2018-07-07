'use strict';

(function () {

  var URL = 'https://js.dump.academy/keksobooking/data';
  var NEEDLE_HEIGHT = 22;

  /**
   * При успешной загрузке данных получаем массив объявлений
   * @param  {Array} pinElements
   */
  var successHadler = function (pinElements) {
    var ads = pinElements.slice();
    window.data.ads = ads;
  };

  window.backend.getData(URL, successHadler, window.utils.errorHandler);

  var mainPin = document.querySelector('.map__pin--main');
  var map = document.querySelector('.map');

  var pinStartCoords = {
    x: mainPin.style.left,
    y: mainPin.style.top
  };

  var formFieldsets = document.querySelectorAll('.ad-form fieldset');

  /**
   * Устанавливаем или убираем атрибут disable у fieldset-ов формы
   * @param  {Boolean} isDisabled
   */
  var disableFieldsets = function (isDisabled) {
    for (var i = 0; i < formFieldsets.length; i++) {
      formFieldsets[i].disabled = isDisabled;
    }
  };

  disableFieldsets(true);
  var isActive = false;

  var mapOverlay = document.querySelector('.map__overlay');

  var pinsNodes = document.querySelector('.map__pins');

  var addressInput = document.querySelector('#address');
  var adForm = document.querySelector('.ad-form');

  var mainPinSizes = {
    width: mainPin.offsetWidth,
    height: mainPin.offsetHeight
  };

  var needlePosition = {
    x: mainPinSizes.width / 2,
    y: mainPinSizes.height + NEEDLE_HEIGHT
  };

  /**
   * Устанавливаем координаты метки в поле адреса
   */
  var setCoords = function () {
    var mainPinX = parseInt(mainPin.style.left, 10);
    var mainPinY = parseInt(mainPin.style.top, 10);
    addressInput.value = (mainPinX + needlePosition.x) + ', ' + (mainPinY + needlePosition.y);
  };


  /**
   * Переводим страницу в активное состояние, если true. Деактивируем, если false
   * @param  {Boolean} isRunning
   */
  var activatePage = function (isRunning) {
    if (!isRunning) {
      map.classList.add('map--faded');
      adForm.classList.add('ad-form--disabled');
      disableFieldsets(true);
      window.card.removePopup();
      pinsNodes.innerHTML = '';
      pinsNodes.appendChild(mapOverlay);
      mainPin.style.left = pinStartCoords.x;
      mainPin.style.top = pinStartCoords.y;
      pinsNodes.appendChild(mainPin);
      mainPin.addEventListener('keydown', mainPinEnterPressHandler);
      isActive = false;
      setCoords();
    } else {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      disableFieldsets(false);
      window.pins.renderPins(window.data.ads);
      setCoords();
    }
  };

  setCoords();

  mainPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    /**
     * При перемещении мышки устанавливаем новые координаты в поле адреса
     * @param  {Object} moveEvt
     */
    var mouseMoveHadler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var mapWidth = map.getBoundingClientRect().width;
      var newX = mainPin.offsetLeft - shift.x;
      if (newX >= 0 && newX <= (mapWidth - mainPinSizes.width)) {
        mainPin.style.left = (newX) + 'px';
      }
      var newY = mainPin.offsetTop - shift.y;
      if (newY >= window.data.MIN_Y && newY <= window.data.MAX_Y) {
        mainPin.style.top = (newY) + 'px';
      }

      setCoords();
    };

    /**
     * При отпускании левой кнопки мыши активируем страницу
     * @param  {Object} upEvt
     */
    var mouseUpHadler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHadler);
      document.removeEventListener('mouseup', mouseUpHadler);

      if (!isActive) {
        activatePage(true);
        isActive = true;
      }
    };

    document.addEventListener('mousemove', mouseMoveHadler);
    document.addEventListener('mouseup', mouseUpHadler);
  });

  /**
   * Если нажат enter при фокусе на главный пин, запускаем страницу
   * @param  {Object} evt
   */
  var mainPinEnterPressHandler = function (evt) {
    if (!isActive && evt.keyCode === window.data.KeyCode.ENTER) {
      activatePage(true);
      isActive = true;
    }
    mainPin.removeEventListener('keydown', mainPinEnterPressHandler);
  };

  mainPin.addEventListener('keydown', mainPinEnterPressHandler);

  window.map = {
    activatePage: activatePage,
  };
})();


