'use strict';

(function () {

  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var RUSSIAN_TYPES = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var AUTHOR_AMOUNT = 8;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;
  var MIN_AMOUNT_ROOMS = 1;
  var MAX_AMOUNT_ROOMS = 5;
  var MIN_AMOUNT_GUESTS = 1;
  var MAX_AMOUNT_GUESTS = 10;
  var MIN_X = 300;
  var MAX_X = 900;
  var MIN_Y = 130;
  var MAX_Y = 630;

  window.data = {
    TITLES: TITLES,
    PHOTOS: PHOTOS,
    TYPES: TYPES,
    RUSSIAN_TYPES: RUSSIAN_TYPES,
    TIMES: TIMES,
    FEATURES: FEATURES,
    AUTHOR_AMOUNT: AUTHOR_AMOUNT,
    MIN_PRICE: MIN_PRICE,
    MAX_PRICE: MAX_PRICE,
    MIN_AMOUNT_ROOMS: MIN_AMOUNT_ROOMS,
    MAX_AMOUNT_ROOMS: MAX_AMOUNT_ROOMS,
    MIN_AMOUNT_GUESTS: MIN_AMOUNT_GUESTS,
    MAX_AMOUNT_GUESTS: MAX_AMOUNT_GUESTS,
    MIN_X: MIN_X,
    MAX_X: MAX_X,
    MIN_Y: MIN_Y,
    MAX_Y: MAX_Y
  };
})();

