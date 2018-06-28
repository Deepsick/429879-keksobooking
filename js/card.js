'use strict';

(function () {

  /**
   * Создаем объект объявления на основе исходных данных
   * @param  {Number} index
   * @return {Object}
   */
  // var createAuthor = function (index) {
  //   var locationX = window.utils.getRandomNumberFrominterval(window.data.MIN_X, window.data.MAX_X);
  //   var locationY = window.utils.getRandomNumberFrominterval(window.data.MIN_Y, window.data.MAX_Y);
  //   var ad = {
  //     'author': {
  //       'avatar': 'img/avatars/user0' + (index + 1) + '.png'
  //     },

  //     'offer': {
  //       'title': window.utils.getRandomeElement(window.data.TITLES, true),
  //       'address': locationX + ', ' + locationY,
  //       'price': window.utils.getRandomNumberFrominterval(window.data.MIN_PRICE, window.data.MAX_PRICE),
  //       'type': window.utils.getRandomeElement(window.data.TYPES),
  //       'rooms': window.utils.getRandomNumberFrominterval(window.data.MIN_AMOUNT_ROOMS, window.data.MAX_AMOUNT_ROOMS),
  //       'guests': window.utils.getRandomNumberFrominterval(window.data.MIN_AMOUNT_GUESTS, window.data.MAX_AMOUNT_GUESTS),
  //       'checkin': window.utils.getRandomeElement(window.data.TIMES),
  //       'checkout': window.utils.getRandomeElement(window.data.TIMES),
  //       'features': window.utils.getRandomArray(window.data.FEATURES, true),
  //       'description': '',
  //       'photos': window.utils.getRandomArray(window.data.PHOTOS)
  //     },

  //     'location': {
  //       'x': locationX,
  //       'y': locationY
  //     }
  //   };
  //   return ad;
  // };

  // for (var i = 0; i < window.data.AUTHOR_AMOUNT; i++) {
  //   var ad = createAuthor(i);
  //   ads.push(ad);
  // }
  var mapCard = document.querySelector('template')
                        .content
                        .querySelector('.map__card');

  /**
   * Создаем элемент объявления на основе объекта author
   * @param  {Object} author
   * @return {Html-node}
   */
  var createAd = function (author) {
    var newAd = mapCard.cloneNode(true);

    newAd.querySelector('.popup__avatar').src = author.author.avatar;
    newAd.querySelector('.popup__title').textContent = author.offer.title;
    newAd.querySelector('.popup__text--address').textContent = author.offer.address;
    newAd.querySelector('.popup__text--price').textContent = author.offer.price + '₽/ночь';
    newAd.querySelector('.popup__type').textContent = window.data.RUSSIAN_TYPES[author.offer.type];
    newAd.querySelector('.popup__text--capacity').textContent = (author.offer.rooms) + ' комнаты для ' + (author.offer.guests) + ' гостей';
    newAd.querySelector('.popup__text--time').textContent = 'Заезд после ' + (author.offer.checkin) + ', выезд до ' + (author.offer.checkout);
    newAd.querySelector('.popup__features').innerHTML = '';
    newAd.querySelector('.popup__features').textContent = author.offer.description;
    newAd.querySelector('.popup__photos').innerHTML = '';
    for (var j = 0; j < author.offer.photos.length; j++) {
      var newPhoto = document.createElement('img');
      newPhoto.src = author.offer.photos[j];
      newPhoto.width = 45;
      newPhoto.height = 40;
      newAd.querySelector('.popup__photos').append(newPhoto);
    }

    for (var k = 0; k < author.offer.features.length; k++) {
      var featuresItem = document.createElement('li');
      featuresItem.classList.add('popup__feature');
      featuresItem.classList.add('popup__feature--' + author.offer.features[k]);
      newAd.querySelector('.popup__features').append(featuresItem);
    }

    return newAd;
  };

  window.card = {
    // ads: ads,
    createAd: createAd
  };
})();
