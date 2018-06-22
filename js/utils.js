'use strict';

(function () {

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

  window.utils = {
    getRandomeElement: getRandomeElement,
    getRandomNumberFrominterval: getRandomNumberFrominterval,
    getRandomArray: getRandomArray
  };
})();
