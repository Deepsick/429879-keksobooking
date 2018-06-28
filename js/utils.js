'use strict';

(function () {

  var NODE_WIDTH = 300;
  var NODE_HEIGHT = 300;
  var BUTTON_WIDTH = 50;
  var BUTTON_HEIGHT = 30;

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

  /**
   * Показываем окно с ошибкой, если данные не загрузились
   * @param  {String} errorMessage
   */
  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style.zIndex = 100;
    node.style.backgroundColor = '#b22222';
    node.style.position = 'absolute';
    node.style.left = '50%';
    node.style.top = '50%';
    node.style.width = NODE_WIDTH + 'px';
    node.style.height = NODE_HEIGHT + 'px';
    node.style.marginLeft = -(NODE_WIDTH / 2) + 'px';
    node.style.borderRadius = '30%';
    node.style.fontSize = '30px';
    node.style.textAlign = 'center';
    node.style.lineHeight = NODE_WIDTH + 'px';
    node.textContent = errorMessage;

    var closeButton = document.createElement('button');
    closeButton.style.backgroundColor = '#ffffe0';
    closeButton.style.position = 'absolute';
    closeButton.style.top = BUTTON_HEIGHT + 'px';
    closeButton.style.right = BUTTON_HEIGHT + 'px';
    closeButton.style.fontSize = '10px';
    closeButton.style.width = BUTTON_WIDTH + 'px';
    closeButton.style.height = BUTTON_HEIGHT + 'px';
    closeButton.style.borderRadius = '30%';
    closeButton.style.border = 'none';
    closeButton.textContent = 'Закрыть';
    closeButton.style.lineHeight = BUTTON_HEIGHT + 'px';
    closeButton.addEventListener('click', function () {
      node.classList.add('hidden');
    });

    node.insertAdjacentElement('afterbegin', closeButton);
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.utils = {
    getRandomeElement: getRandomeElement,
    getRandomNumberFrominterval: getRandomNumberFrominterval,
    getRandomArray: getRandomArray,
    errorHandler: errorHandler
  };
})();
