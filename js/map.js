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

/**
 * Устанавливаем или убираем атрибут disable у fieldset-ов формы
 * @param  {Boolean} isDisabled
 */
var disableFieldsets = function (isDisabled) {
  for (i = 0; i < formFieldsets.length; i++) {
    formFieldsets[i].disabled = isDisabled;
  }
};

disableFieldsets(true);

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

/**
 * Создаем массив html-node меток объявлений
 * @return {Array}
 */
var createPinsArray = function () {
  var pins = [];
  for (i = 0; i < ads.length; i++) {
    pins.push(createPin(ads[i]));
    pinFragment.appendChild(pins[i]);
  }
  return pins;
};

var pins = createPinsArray();
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
    featuresItem.classList.add('popup__feature');
    featuresItem.classList.add('popup__feature--' + author.offer.features[i]);
    newAd.querySelector('.popup__features').append(featuresItem);
  }

  return newAd;
};

var mainPin = document.querySelector('.map__pin--main');
var mapOverlay = document.querySelector('.map__overlay');
var adForm = document.querySelector('.ad-form');
var addressInput = document.querySelector('#address');

var PIN_START_COORDS = {
  x: mainPin.style.left,
  y: mainPin.style.top
};

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
 * Получаем html-node и удаляем из разметки
 * @param  {Html-node} popup
 */
var closePopup = function (popup) {
  map.removeChild(popup);
};

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
  filtersContainer.before(createAd(ads[index]));
  popup = document.querySelector('.popup');
  var closePopupButton = document.querySelector('.popup__close');
  closePopupButton.addEventListener('click', function () {
    closePopup(popup);
  });
};

/**
 * Устанавливаем координаты метки в поле адреса
 */
var setCoords = function () {
  var mainPinX = parseInt(mainPin.style.left, 10);
  var mainPinY = parseInt(mainPin.style.top, 10);
  addressInput.value = (mainPinX + needlePosition.x) + ', ' + (mainPinY + needlePosition.y);
};

setCoords();

var pinsNodes = document.querySelector('.map__pins');


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
    pins = createPinsArray();
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

var typeInput = document.querySelector('#type');
var priceInput = document.querySelector('#price');

var minPriceType = {
  'palace': 10000,
  'house': 5000,
  'flat': 1000,
  'bungalo': 0
};

/**
 * Устанавливаем минимальную цену за выбранный тип жилья
 */
var setTypePrice = function () {
  var typeValue = minPriceType[typeInput.value];
  priceInput.min = typeValue;
  priceInput.placeholder = typeValue;
};

setTypePrice();

typeInput.addEventListener('change', function () {
  setTypePrice();
});


var timeinInput = document.querySelector('#timein');
var timeoutInput = document.querySelector('#timeout');

timeinInput.addEventListener('change', function () {
  timeoutInput.value = timeinInput.value;
});
timeoutInput.addEventListener('change', function () {
  timeinInput.value = timeoutInput.value;
});

var roomNumberInput = document.querySelector('#room_number');
var capacityInput = document.querySelector('#capacity');

/**
 * Проверяем синхронизацию количество выбранных гостей с количеством выбранных комнат
 */
var checkCapacity = function () {
  if (roomNumberInput.value === '100' && capacityInput.value !== '0') {
    capacityInput.setCustomValidity('100 комнат не для гостей!');
  } else if (capacityInput.value === '0' && roomNumberInput.value !== '100') {
    capacityInput.setCustomValidity('Укажите количество гостей!');
  } else if (+roomNumberInput.value < +capacityInput.value) {
    capacityInput.setCustomValidity('Слишком много гостей для такого количества комнат!');
  } else {
    capacityInput.setCustomValidity('');
  }
};

checkCapacity();

capacityInput.addEventListener('change', function () {
  checkCapacity();
});

roomNumberInput.addEventListener('change', function () {
  checkCapacity();
});


var resetButton = document.querySelector('.ad-form__reset');
resetButton.addEventListener('click', function () {
  adForm.reset();
  activatePage(false);
});
