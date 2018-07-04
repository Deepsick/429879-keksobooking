'use strict';

(function () {

  var RUSSIAN_TYPES = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var AMOUNT_OF_PINS = 5;
  var MIN_X = 300;
  var MAX_X = 900;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var ads;

  window.data = {
    RUSSIAN_TYPES: RUSSIAN_TYPES,
    MIN_X: MIN_X,
    MAX_X: MAX_X,
    MIN_Y: MIN_Y,
    MAX_Y: MAX_Y,
    AMOUNT_OF_PINS: AMOUNT_OF_PINS,
    FILE_TYPES: FILE_TYPES,
    ads: ads
  };
})();

