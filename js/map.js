'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AVATAR_IDS = [];
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


for (var i = 1; i <= AUTHOR_AMOUNT; i++) {
  var id = '0' + i.toString();
  AVATAR_IDS.push(id);
}


var getRandomeElement = function (array, isUnique, isNotDeleted) {
  var currentArray = array;
  if (isNotDeleted) {
    currentArray = array.slice();
  }
  var randomElement = currentArray[Math.floor(Math.random() * currentArray.length)];
  if (isUnique) {
    currentArray.splice(currentArray.indexOf(randomElement), 1);
  }
  return randomElement;
};

var getRandomNumberFrominterval = function (start, end) {
  var randomNumber = Math.floor(Math.random() * (end - start) + start);
  return randomNumber;
};

var getRandomArray = function (array, isRandomLength) {
  var newArray = [];
  var arrayLength = array.length;
  if (isRandomLength) {
    arrayLength = getRandomNumberFrominterval(0, arrayLength + 1);
  }
  while (arrayLength > 0) {
    var randomUniqueElement = getRandomeElement(array, true, true);
    if (newArray.indexOf(randomUniqueElement) === -1) {
      newArray.push(randomUniqueElement);
      arrayLength--;
    }
  }
  return newArray;
};

var ads = [];

for (i = 0; i < AUTHOR_AMOUNT; i++) {
  var locationX = getRandomNumberFrominterval(MIN_X, MAX_X);
  var locationY = getRandomNumberFrominterval(MIN_Y, MAX_Y);
  var ad = {
    'author': {
      'avatar': 'img/avatars/user' + getRandomeElement(AVATAR_IDS, true) + '.png'
    },

    'offer': {
      'title': getRandomeElement(TITLES, true),
      'address': locationX.toString() + ', ' + locationY.toString(),
      'price': getRandomNumberFrominterval(MIN_PRICE, MAX_PRICE),
      'type': getRandomeElement(TYPES),
      'rooms': getRandomNumberFrominterval(MIN_AMOUNT_ROOMS, MAX_AMOUNT_ROOMS),
      'guests': getRandomNumberFrominterval(MIN_AMOUNT_GUESTS, MAX_AMOUNT_GUESTS),
      'checkin': getRandomeElement(TIMES),
      'checkout': getRandomeElement(TIMES),
      'features': getRandomArray(FEATURES, true),
      'description': '',
      'photos': getRandomArray(PHOTOS)
    },

    'location': {
      'x': locationX,
      'y': locationY
    }
  };
  ads.push(ad);
}

var map = document.querySelector('.map');
var mapCard = document.querySelector('template')
              .content
              .querySelector('.map__card');
var pin = document.querySelector('template')
          .content
          .querySelector('.map__pin');

map.classList.remove('map--faded');

var createPin = function (author) {
  var newPin = pin.cloneNode(true);

  newPin.querySelector('img').src = author.author.avatar;
  newPin.querySelector('img').alt = author.offer.title;
  newPin.style.left = author.location.x.toString() + 'px';
  newPin.style.top = author.location.y.toString() + 'px';

  return newPin;
};

var pinFragment = document.createDocumentFragment();
for (i = 0; i < ads.length; i++) {
  pinFragment.appendChild(createPin(ads[i]));
}
document.querySelector('.map__pins').appendChild(pinFragment);


var createAd = function (author) {
  var newAd = mapCard.cloneNode(true);

  newAd.querySelector('.popup__avatar').src = author.author.avatar;
  newAd.querySelector('.popup__title').textContent = author.offer.title;
  newAd.querySelector('.popup__text--address').textContent = author.offer.address;
  newAd.querySelector('.popup__text--price').textContent = author.offer.price + '₽/ночь';
  newAd.querySelector('.popup__type').textContent = RUSSIAN_TYPES[author.offer.type];
  newAd.querySelector('.popup__text--capacity').textContent = (author.offer.rooms).toString() + ' комнаты для ' + (author.offer.guests).toString() + ' гостей';
  newAd.querySelector('.popup__text--time').textContent = 'Заезд после ' + (author.offer.checkin).toString() + ', выезд до ' + (author.offer.checkout).toString();
  newAd.querySelector('.popup__features').innerHTML = '';
  newAd.querySelector('.popup__features').textContent = author.offer.description;
  newAd.querySelector('.popup__photos').innerHTML = '';
  for (i = 0; i < author.offer.photos.length; i++) {
    var newPhoto = document.createElement('img');
    newPhoto.src = author.offer.photos[i];
    newAd.querySelector('.popup__photos').append(newPhoto);
  }

  for (i = 0; i < author.offer.features.length; i++) {
    var featuresItem = document.createElement('li');
    featuresItem.textContent = author.offer.features[i];
    newAd.querySelector('.popup__features').append(featuresItem);
  }

  return newAd;
};

var currentAd = createAd(ads[0]);
// for (i = 0; i < ads.length; i++) {
//   AdFragment.appendChild(createAd(ads[i]));
// }
document.querySelector('.map__filters-container').before(currentAd);

