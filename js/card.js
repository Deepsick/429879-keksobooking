'use strict';

(function () {

  var mapCard = document.querySelector('template')
                        .content
                        .querySelector('.map__card');

  /**
   * Скрываем элемент на странице
   * @param  {Object} element
   */
  var hideElement = function (element) {
    element.style.display = 'none';
  };

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
    newAd.querySelector('.popup__description').textContent = author.offer.description;
    newAd.querySelector('.popup__photos').innerHTML = '';
    for (var j = 0; j < author.offer.photos.length; j++) {
      var newPhoto = document.createElement('img');
      newPhoto.src = author.offer.photos[j];
      newPhoto.width = 45;
      newPhoto.height = 40;
      newPhoto.classList.add('popup__photo');
      newAd.querySelector('.popup__photos').append(newPhoto);
    }
    var featuresList = newAd.querySelector('.popup__features');
    if (author.offer.features.length > 0) {
      for (var k = 0; k < author.offer.features.length; k++) {
        var featuresItem = document.createElement('li');
        featuresItem.classList.add('popup__feature');
        featuresItem.classList.add('popup__feature--' + author.offer.features[k]);
        featuresList.append(featuresItem);
      }
    } else {
      hideElement(featuresList);
    }
    return newAd;
  };

  var map = document.querySelector('.map');
  /**
   * Получаем html-node и удаляем из разметки
   * @param  {Html-node} popup
   */
  var closePopup = function () {
    var popup = document.querySelector('.popup');
    map.removeChild(popup);
    document.removeEventListener('keydown', popupEscPressHadler);
    window.pins.activatePin(false);
  };

  /**
   * Если нажат esc, то закрываем попап
   * @param  {Object} evt
   */
  var popupEscPressHadler = function (evt) {
    if (evt.keyCode === window.data.KeyCode.ESC) {
      closePopup();
    }
  };

  /**
   * Если попап есть, то скрываем его
   */
  var removePopup = function () {
    var popup = document.querySelector('.popup');
    if (popup) {
      closePopup();
    }
  };

  var filtersContainer = document.querySelector('.map__filters-container');
  /**
   * Получаем htm-node метки pinNode и вставляем соответствующее объявление в разметку. Если
   * объявление уже есть в разметке, то оно удаляется. Также вешаем на текущее объявление
   * обработчика клика для кнопки закрытия попапа.
   * @param  {Html-node} pinNode
   * @param  {Array} pinsArray
   * @param  {Array} adsArray
   */
  var showAd = function (pinNode, pinsArray, adsArray) {
    var index = pinsArray.indexOf(pinNode);
    removePopup();
    filtersContainer.before(window.card.createAd(adsArray[index]));
    var closePopupButton = document.querySelector('.popup__close');
    closePopupButton.addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', popupEscPressHadler);
  };

  window.card = {
    createAd: createAd,
    showAd: showAd,
    removePopup: removePopup
  };
})();
