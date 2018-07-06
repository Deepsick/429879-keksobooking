'use strict';

(function () {

  var pin = document.querySelector('template')
                    .content
                    .querySelector('.map__pin');

  /**
   * Создаем элемент метки на основе объекта
   * @param  {Object} author
   * @return {Html-node}
   */
  var createPin = function (author) {
    var newPin = pin.cloneNode(true);

    newPin.querySelector('img').src = author.author.avatar;
    newPin.querySelector('img').alt = author.offer.title;
    newPin.style.left = author.location.x + 'px';
    newPin.style.top = author.location.y + 'px';

    return newPin;
  };

  /**
   * Создаем массив html-node меток объявлений
   * @param  {Html-node} pinFragment
   * @param  {Array} ads
   * @param  {Number} amount
   * @return {Array}
   */
  var createPinsArray = function (pinFragment, ads, amount) {
    var pins = [];
    for (var i = 0; i < amount; i++) {
      pins.push(createPin(ads[i]));
      pinFragment.appendChild(pins[i]);
    }
    return pins;
  };

  /**
   * Убираем или удаляем подсветку активного пина
   * @param  {Boolean} isActivated
   * @param  {Html-node}  pinElement
   */
  var activatePin = function (isActivated, pinElement) {
    if (isActivated) {
      pinElement.classList.add('map__pin--active');
    } else {
      var activePin = document.querySelector('.map__pin--active');
      if (activePin) {
        activePin.classList.remove('map__pin--active');
      }
    }
  };

  var adsArray;
  var pins;
  /**
   * При клике на пин запускаем функцию, которая отрисовывает объявление и
   * подсвечивает пин
   * @param  {Object} evt [description]
   */
  var showPopup = function (evt) {
    var target = evt.target;
    if (target.classList.contains('map__pin--main') ||
        target.parentNode.classList.contains('map__pin--main')) {
      return;
    } else if (target.className === 'map__pin' || (target.classlist !== undefined && target.classlist.contains('map__pin'))) {
      window.card.showAd(target, pins, adsArray);
      window.pins.activatePin(true, target);
    } else if (target.tagName.toLowerCase() === 'img' && target.parentNode.classList.contains('map__pin')) {
      window.card.showAd(target.parentNode, pins, adsArray);
      window.pins.activatePin(true, target.parentNode);
    }
  };

  /**
   * Если нажат enter, показываем попап
   * @param  {[type]} pressEvt [description]
   */
  var pinEnterPressHadler = function (pressEvt) {
    if (pressEvt.keyCode === window.data.KeyCode.ENTER) {
      showPopup(pressEvt);
    }
  };

  /**
   * Открываем попап с объявлением при клике на соответствующий пин
   * @param  {Object} clickEvt]
   */
  var pinsNodesClickHandler = function (clickEvt) {
    showPopup(clickEvt);
  };

  var pinsNodes = document.querySelector('.map__pins');
  var mainPin = document.querySelector('.map__pin--main');
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
   * Убираем текущие пины с карты и отрисовываем новые в соответствии массиву filteredArray
   * @param  {Array} filteredArray
   */
  var updatePins = function (filteredArray) {
    window.card.removePopup();
    renderPins(filteredArray);
  };


  window.pins = {
    createPinsArray: createPinsArray,
    activatePin: activatePin,
    renderPins: renderPins,
    updatePins: updatePins
  };
})();
