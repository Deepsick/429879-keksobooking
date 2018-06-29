'use strict';

(function () {
  /**
   * При успешной загрузке данных отрисовываем и запускаем страницу
   * @param  {Array} pinElements
   */
  var successHadler = function (pinElements) {
    var ads = pinElements.slice();

    var mainPin = document.querySelector('.map__pin--main');
    var map = document.querySelector('.map');

    var PIN_START_COORDS = {
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

    var filtersContainer = document.querySelector('.map__filters-container');
    var mapOverlay = document.querySelector('.map__overlay');

    /**
     * Получаем html-node и удаляем из разметки
     * @param  {Html-node} popup
     */
    var closePopup = function (popup) {
      map.removeChild(popup);
    };

    var pinFragment = document.createDocumentFragment();
    var pins = window.pins.createPinsArray(pinFragment, ads);

    /**
    * Получаем htm-node метки pinNode и вставляем соответствующее объявление в разметку. Если
    * объявление уже есть в разметке, то оно удаляется. Также вешаем на текущее объявление
    * обработчика клика для кнопки закрытия попапа.
    * @param  {Html-node} pinNode
    */
    var showAd = function (pinNode) {
      var index = pins.indexOf(pinNode);
      var popup = document.querySelector('.popup');
      if (popup) {
        closePopup(popup);
      }
      filtersContainer.before(window.card.createAd(ads[index]));
      popup = document.querySelector('.popup');
      var closePopupButton = document.querySelector('.popup__close');
      closePopupButton.addEventListener('click', function () {
        closePopup(popup);
      });
    };

    var pinsNodes = document.querySelector('.map__pins');

    var addressInput = document.querySelector('#address');
    var adForm = document.querySelector('.ad-form');

    var mainPinSizes = {
      width: mainPin.offsetWidth,
      height: mainPin.offsetHeight
    };
    var needleHeight = 22;
    var needlePosition = {
      x: mainPinSizes.width / 2,
      y: mainPinSizes.height + needleHeight
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
     * @param  {Boolean} isActive
     */
    var activatePage = function (isActive) {
      if (!isActive) {
        map.classList.add('map--faded');
        adForm.classList.add('ad-form--disabled');
        disableFieldsets(true);

        pinsNodes.innerHTML = '';
        pinsNodes.appendChild(mapOverlay);
        mainPin.style.left = PIN_START_COORDS.x;
        mainPin.style.top = PIN_START_COORDS.y;
        pinsNodes.appendChild(mainPin);
        var popup = document.querySelector('.popup');
        if (popup) {
          closePopup(popup);
        }
        setCoords();
      } else {
        map.classList.remove('map--faded');
        adForm.classList.remove('ad-form--disabled');
        disableFieldsets(false);
        pinFragment = document.createDocumentFragment();
        pins = window.pins.createPinsArray(pinFragment, ads);
        pinsNodes.appendChild(pinFragment);

        pinsNodes.addEventListener('click', function (clickEvt) {
          var target = clickEvt.target;
          if (target.classList.contains('map__pin--main') ||
              target.parentNode.classList.contains('map__pin--main')) {
            return;
          } else if (target.className === 'map__pin') {
            showAd(target);
          } else if (target.parentNode.className === 'map__pin') {
            showAd(target.parentNode);
          }
        });

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

        activatePage(true);
      };

      document.addEventListener('mousemove', mouseMoveHadler);
      document.addEventListener('mouseup', mouseUpHadler);
    });

    window.map = {
      activatePage: activatePage
    };
  };

  var url = 'https://js.dump.academy/keksobooking/data';
  window.backend.getData(url, successHadler, window.utils.errorHandler);
})();


