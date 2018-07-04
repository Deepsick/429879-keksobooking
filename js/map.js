'use strict';

(function () {

  var URL = 'https://js.dump.academy/keksobooking/data';
  var NEEDLE_HEIGHT = 22;
  var KeyCode = {
    ESC: 27,
    ENTER: 13
  };

  /**
   * При успешной загрузке данных получаем массив объявлений
   * @param  {Array} pinElements
   */
  var successHadler = function (pinElements) {
    var ads = pinElements.slice();
    window.data.ads = ads;
  };

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

  var filtersContainer = document.querySelector('.map__filters-container');
  var mapOverlay = document.querySelector('.map__overlay');

  /**
   * Получаем html-node и удаляем из разметки
   * @param  {Html-node} popup
   */
  var closePopup = function () {
    var popup = document.querySelector('.popup');
    map.removeChild(popup);
    document.removeEventListener('keydown', popupEscPressHadler);
    activatePin(false);
  };

  /**
   * Если нажат esc, то закрываем попап
   * @param  {Object} evt
   */
  var popupEscPressHadler = function (evt) {
    if (evt.keyCode === KeyCode.ESC) {
      closePopup();
    }
  };


  /**
   * Убираем или удаляем подсветку активного пина
   * @param  {Boolean} isActivated
   * @param  {Html-node}  pin
   */
  var activatePin = function (isActivated, pin) {
    if (isActivated) {
      pin.classList.add('map__pin--active');
    } else {
      var activePin = document.querySelector('.map__pin--active');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
    }
  };

  /**
   * Если попап есть, то скрываем его
   */
  var checkPopup = function () {
    var popup = document.querySelector('.popup');
    if (popup) {
      closePopup();
    }
  };

  /**
   * Получаем htm-node метки pinNode и вставляем соответствующее объявление в разметку. Если
   * объявление уже есть в разметке, то оно удаляется. Также вешаем на текущее объявление
   * обработчика клика для кнопки закрытия попапа.
   * @param  {Html-node} pinNode
   * @param  {Array} pinsArray
   * @param  {Array} adsArray
   */
  var showAd = function (pinNode, pinsArray, adsArray) {
    var index = pinsArray.indexOf(pinNode);
    checkPopup();
    filtersContainer.before(window.card.createAd(adsArray[index]));
    var closePopupButton = document.querySelector('.popup__close');
    closePopupButton.addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', popupEscPressHadler);
  };

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

  var pinEnterPressHadler = function (pressEvt) {
    if (pressEvt.keyCode === KeyCode.ENTER) {
      shopPopup(pressEvt);
    }
  };
  /**
   * Открываем попап с объявлением при клике на соответствующий пин
   * @param  {Object} clickEvt]
   */
  var pinsNodesClickHandler = function (clickEvt) {
    shopPopup(clickEvt);
  };

  var shopPopup = function (evt) {
    var target = evt.target;
    if (target.classList.contains('map__pin--main') ||
        target.parentNode.classList.contains('map__pin--main')) {
      return;
    } else if (target.className === 'map__pin' || (target.classlist !== undefined && target.classlist.contains('map__pin'))) {
      showAd(target, pins, adsArray);
      activatePin(true, target);
    } else if (target.tagName.toLowerCase() === 'img' && target.parentNode.classList.contains('map__pin')) {
      showAd(target.parentNode, pins, adsArray);
      activatePin(true, target.parentNode);
    }
  };

  /**
   * Устанавливаем координаты метки в поле адреса
   */
  var setCoords = function () {
    var mainPinX = parseInt(mainPin.style.left, 10);
    var mainPinY = parseInt(mainPin.style.top, 10);
    addressInput.value = (mainPinX + needlePosition.x) + ', ' + (mainPinY + needlePosition.y);
  };


  var adsArray;
  var pins;
  /**
   * Отрисовываем пины на основе массива объявлений array
   * @param  {[type]} array [description]
   */
  var renderPins = function (array) {
    pinsNodes.removeEventListener('click', pinsNodesClickHandler);
    pinsNodes.removeEventListener('keydown', pinEnterPressHadler);
    adsArray = array.slice();
    var pinFragment = document.createDocumentFragment();
    var amountOfActivePins = Math.min(window.data.AMOUNT_OF_PINS, adsArray.length);
    pins = window.pins.createPinsArray(pinFragment, adsArray, amountOfActivePins);
    pinsNodes.innerHTML = '';
    pinsNodes.appendChild(pinFragment);
    pinsNodes.appendChild(mainPin);
    pinsNodes.addEventListener('click', pinsNodesClickHandler);
    pinsNodes.addEventListener('keydown', pinEnterPressHadler);
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
      checkPopup();
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
      renderPins(window.data.ads);
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
      if (newY >= 130 && newY <= 630) {
        mainPin.style.top = (newY) + 'px';
      }

      setCoords();
    };

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

  var mainPinEnterPressHandler = function (evt) {
    if (!isActive && evt.keyCode === KeyCode.ENTER) {
      activatePage(true);
      isActive = true;
    }
    mainPin.removeEventListener('keydown', mainPinEnterPressHandler);
  };

  mainPin.addEventListener('keydown', mainPinEnterPressHandler);

  window.backend.getData(URL, successHadler, window.utils.errorHandler);

  window.map = {
    activatePage: activatePage,
    showAd: showAd,
    renderPins: renderPins,
    checkPopup: checkPopup
  };
})();


