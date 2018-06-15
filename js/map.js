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
var MAIN_PIN_SIZES = {
  width: 40,
  height: 44
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
  var id = '0' + i;
  AVATAR_IDS.push(id);
}

/**
 * Получаем случайный элемент массива array
 * @param  {Array}  array        Массив, из которого берется случайный элемент
 * @param  {Boolean} isUnique
 * @param  {Boolean} isNotDeleted
 * @return {any}
 */
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

/**
 * Получаем случайный элемент из диапазона start-end
 * @param  {[number]} start
 * @param  {[number]} end
 * @return {[number]}
 */
var getRandomNumberFrominterval = function (start, end) {
  var randomNumber = Math.floor(Math.random() * (end - start) + start);
  return randomNumber;
};

/**
 * Получаем массив элементов в случайном порядке из массива array
 * @param  {Array}  array
 * @param  {Boolean} isRandomLength Если true, устанавливаем случайную длину нового массива,
 * но не больше, чем длина исходного массива
 * @return {Array}
 */
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

/**
 * Создаем объект объявления на основе исходных данных
 * @return {[Object]}
 */
var createAuthor = function () {
  var locationX = getRandomNumberFrominterval(MIN_X, MAX_X);
  var locationY = getRandomNumberFrominterval(MIN_Y, MAX_Y);
  var ad = {
    'author': {
      'avatar': 'img/avatars/user' + getRandomeElement(AVATAR_IDS, true) + '.png'
    },

    'offer': {
      'title': getRandomeElement(TITLES, true),
      'address': locationX + ', ' + locationY,
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
  return ad;
};

for (i = 0; i < AUTHOR_AMOUNT; i++) {
  var ad = createAuthor();
  ads.push(ad);
}

var map = document.querySelector('.map');
var mapCard = document.querySelector('template')
                      .content
                      .querySelector('.map__card');
var pin = document.querySelector('template')
                  .content
                  .querySelector('.map__pin');

var formFieldsets = document.querySelectorAll('.ad-form fieldset');
for (i = 0; i < formFieldsets.length; i++) {
  formFieldsets[i].disabled = true;
}

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
var filtersContainer = document.querySelector('.map__filters-container');

var pinFragment = document.createDocumentFragment();
var pins = [];
for (i = 0; i < ads.length; i++) {
  pins.push(createPin(ads[i]));
  pinFragment.appendChild(pins[i]);
}

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
  newAd.querySelector('.popup__type').textContent = RUSSIAN_TYPES[author.offer.type];
  newAd.querySelector('.popup__text--capacity').textContent = (author.offer.rooms) + ' комнаты для ' + (author.offer.guests) + ' гостей';
  newAd.querySelector('.popup__text--time').textContent = 'Заезд после ' + (author.offer.checkin) + ', выезд до ' + (author.offer.checkout);
  newAd.querySelector('.popup__features').innerHTML = '';
  newAd.querySelector('.popup__features').textContent = author.offer.description;
  newAd.querySelector('.popup__photos').innerHTML = '';
  for (i = 0; i < author.offer.photos.length; i++) {
    var newPhoto = document.createElement('img');
    newPhoto.src = author.offer.photos[i];
    newPhoto.width = 45;
    newPhoto.height = 40;
    newAd.querySelector('.popup__photos').append(newPhoto);
  }

  for (i = 0; i < author.offer.features.length; i++) {
    var featuresItem = document.createElement('li');
    featuresItem.textContent = author.offer.features[i];
    newAd.querySelector('.popup__features').append(featuresItem);
  }

  return newAd;
};

var mainPin = document.querySelector('.map__pin--main');
var mainPinX = parseInt(mainPin.style.left, 10);
var mainPinY = parseInt(mainPin.style.top, 10);
var adForm = document.querySelector('.ad-form');
var addressInput = document.querySelector('#address');


mainPin.addEventListener('mouseup', function () {

  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (i = 0; i < formFieldsets.length; i++) {
    formFieldsets[i].disabled = false;
  }
  addressInput.value = (mainPinX + MAIN_PIN_SIZES.width / 2) + ', ' + (mainPinY + MAIN_PIN_SIZES.height);
  document.querySelector('.map__pins').appendChild(pinFragment);


  var showAd = function (pinNode) {
    var index = pins.indexOf(pinNode);
    var popup = document.querySelector('.popup');
    if (popup) {
      map.removeChild(popup);
    }
    filtersContainer.before(createAd(ads[index]));
  };
  // for (i = 0; i < pins.length; i++) {
  //   var index = pins.indexOf(pins[i]);
  //   pins[i].addEventListener('click', function () {
  //     showAd(index);
  //   });
  // }
  map.addEventListener('click', function (evt) {
    var target = evt.target;
    if (target.classList.contains('map__pin--main') ||
        target.parentNode.classList.contains('map__pin--main')) {
      return;
    } else if (target.tagName.toLowerCase() === 'button') {
      showAd(target);
    } else if (target.tagName.toLowerCase() === 'img') {
      showAd(target.parentNode);
    }
  });
});

