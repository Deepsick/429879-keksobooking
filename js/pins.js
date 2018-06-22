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
   * @return {Array}
   */
  var createPinsArray = function (pinFragment) {
    var pins = [];
    for (var i = 0; i < window.card.ads.length; i++) {
      pins.push(createPin(window.card.ads[i]));
      pinFragment.appendChild(pins[i]);
    }
    return pins;
  };

  window.pins = {
    createPinsArray: createPinsArray
  };
})();
