'use strict';

(function () {

  var defaultSelectValue = 'any';
  var firstPartId = 'housing-';

  var filtersIdToValue = {
    'housing-price': defaultSelectValue,
    'housing-type': defaultSelectValue,
    'housing-rooms': defaultSelectValue,
    'housing-guests': defaultSelectValue
  };

  var Price = {
    MIN: 0,
    MIDDLE: 10000,
    MAX: 50000
  };

  var priceValueMap = {
    low: Price.MIN,
    middle: Price.MIDDLE,
    high: Price.MAX
  };

  priceValueMap[defaultSelectValue] = defaultSelectValue;
  var filterCategories = ['price', 'type', 'rooms', 'guests'];

  var filtersBlock = document.querySelector('.map__filters');

  /* При изменении значения одного из выпадаюших списков запоминаем выбранное
  значение в словарь filtersIdToValue, который изначально установлен в значения
  по умолчанию. Затем фильтруем массив объявлений и отрисовываем отфильтрованный
  */
  filtersBlock.addEventListener('change', function (changeEvt) {
    window.map.removePopup();

    var select = changeEvt.target;
    if (select.classList.contains('map__filter')) {
      var currentValue = select.options[select.selectedIndex].value;
      var targetId = select.id;
      filtersIdToValue[targetId] = currentValue;
    }
    window.debounce(filterAds);
  });

  var defaultFeature = false;
  var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var inputValuesToFeatures = {
  };
  featuresList.forEach(function (feauture) {
    inputValuesToFeatures[feauture] = defaultFeature;
  });

  /* При клике на одно из удобств устанавливаем значение данного удобства в true,
  если чекбокс удобства чекнут, в словарь inputValuesToFeatures, иначе false
  (изначально установлен по умолчанию). Затем фильтруем массив объявлений
  и отрисовываем отфильтрованный
  */
  var featuresBlock = filtersBlock.querySelector('.map__features');
  featuresBlock.addEventListener('click', function (clickEvt) {
    window.map.removePopup();
    var checkbox = clickEvt.target;
    if (checkbox.classList.contains('map__checkbox')) {
      var checkboxValue = checkbox.value;
      if (checkbox.checked) {
        inputValuesToFeatures[checkboxValue] = true;
      } else {
        inputValuesToFeatures[checkboxValue] = false;
      }
    }
    window.debounce(filterAds);
  });

  /**
   * Фильтруем объявления массива adsArray по цене в зависимости от
   * установленного значения цены. Затем возвращаем отфильтрованный массив
   * @param  {Array} adsArray
   * @return {Array}
   */
  var filterPrice = function (adsArray) {
    var filterCategory = filterCategories[0];
    var selectValue = priceValueMap[filtersIdToValue['housing-price']];
    adsArray = adsArray.filter(function (ad) {
      var optionPrice = ad.offer[filterCategory];
      if (selectValue === defaultSelectValue) {
        return ad;
      } else if (selectValue === priceValueMap.low) {
        return optionPrice >= priceValueMap.low && optionPrice < priceValueMap.middle;
      } else if (selectValue === priceValueMap.high) {
        return optionPrice > priceValueMap.high;
      } else {
        return optionPrice <= priceValueMap.high && optionPrice >= priceValueMap.middle;
      }
    });
    return adsArray;
  };

  /**
   * Фильтруем массив объявлений array по всем текущим значениям выпадающих списков,
   * кроме цены(цена фильтруется в другой функции). Затем вовзращаем отфильтрованный
   * массив
   * @param  {Array} array
   * @return {Array}
   */
  var filterSelectsWithoutPrice = function (array) {
    for (var i = 1; i < filterCategories.length; i++) {
      var currentCategory = filterCategories[i];
      var currentCategoryValue = filtersIdToValue[firstPartId + filterCategories[i]];
      if (currentCategoryValue !== defaultSelectValue) {
        array = array.filter(function (ad) {
          return ad.offer[currentCategory].toString() === currentCategoryValue;
        });
      }
    }
    return array;
  };

  /**
   * Фильтруем массив объявлений filteredArray в зависимости от выбранных дополни-
   * тельных удобств(чекбоксы). Если удобство выбрано, то будем искать объявления
   * с таким удобством. После возвращаем отфильтрованный массив.
   * @param  {Array} filteredArray
   * @return {Array}
   */
  var filterFeatures = function (filteredArray) {
    var filterCategory = 'features';
    filteredArray = filteredArray.filter(function (ad) {
      var features = ad.offer[filterCategory];
      var checkedFeatures = [];

      featuresList.forEach(function (featureItem) {
        if (inputValuesToFeatures[featureItem]) {
          checkedFeatures.push(featureItem);
        }
      });
      var checkedFeaturesLength = checkedFeatures.length;
      if (checkedFeaturesLength > 0) {
        var answer = window.utils.arrayIncludesAnotherArray(checkedFeatures, features);
        return answer;
      } else {
        return ad;
      }
    });
    return filteredArray;
  };

  /**
   * Фильтруем объявления и отрисовываем пины подходящих объявлений. Создаем новый
   * массив объявлений, сначала фильтруем его по цене, потом по значениям оставшихся
   * выпадающих списков, после этот же массив фильтруем по выбранным удобствам и
   * наконец отрисовываем отфильтрованный массив на страницу.
   */
  var filterAds = function () {
    var filteredAds = window.data.ads.slice();

    filteredAds = filterPrice(filteredAds);
    filteredAds = filterSelectsWithoutPrice(filteredAds);
    filteredAds = filterFeatures(filteredAds);

    window.map.renderPins(filteredAds);
  };
})();
