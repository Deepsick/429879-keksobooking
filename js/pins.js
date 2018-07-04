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

  window.pins = {
    createPinsArray: createPinsArray
  };
})();
