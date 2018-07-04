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
  filtersBlock.addEventListener('change', function (changeEvt) {
    window.map.checkPopup();

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

  var featuresBlock = filtersBlock.querySelector('.map__features');
  featuresBlock.addEventListener('click', function (clickEvt) {
    window.map.checkPopup();
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
   * Фильтруем объявления и отрисовываем пины подходящих объявлений
   */
  var filterAds = function () {
    var filteredAds = window.data.ads.slice();

    var filterCategory = filterCategories[0];
    var selectValue = priceValueMap[filtersIdToValue['housing-price']];
    filteredAds = filteredAds.filter(function (ad) {
      var optionPrice = ad.offer[filterCategory];
      if (selectValue === defaultSelectValue) {
        return ad;
      } else if (selectValue === priceValueMap.low) {
        return optionPrice > priceValueMap.low && optionPrice < priceValueMap.middle;
      } else if (selectValue === priceValueMap.high) {
        return optionPrice > priceValueMap.high;
      } else {
        return optionPrice < priceValueMap.high && optionPrice > priceValueMap.middle;
      }
    });

    for (var i = 1; i < filterCategories.length; i++) {
      var currentCategory = filterCategories[i];
      var currentCategoryValue = filtersIdToValue[firstPartId + filterCategories[i]];
      if (currentCategoryValue !== defaultSelectValue) {
        filteredAds = filteredAds.filter(function (ad) {
          return ad.offer[currentCategory].toString() === currentCategoryValue;
        });
      }
    }

    filterCategory = 'features';
    filteredAds = filteredAds.filter(function (ad) {
      var features = ad.offer[filterCategory];
      var checkedFeatures = [];

      featuresList.forEach(function (featureItem) {
        if (inputValuesToFeatures[featureItem]) {
          checkedFeatures.push(featureItem);
        }
      });
      var checkedFeaturesLength = checkedFeatures.length;
      if (checkedFeaturesLength > 0) {
        var answer;
        var counter = 0;
        var checkedLength;
        var longest;
        var shortest;
        if (checkedFeaturesLength < features.length) {
          longest = features;
          shortest = checkedFeatures;
          checkedLength = features.length;
        } else {
          longest = checkedFeatures;
          shortest = features;
          checkedLength = checkedFeaturesLength;
        }
        for (i = 0; i < checkedLength; i++) {
          if (shortest.indexOf(longest[i]) !== -1) {
            counter += 1;
            continue;
          }
        }
        if (checkedFeaturesLength === counter) {
          answer = true;
        } else {
          answer = false;
        }
        return answer;
      } else {
        return ad;
      }
    });
    window.map.renderPins(filteredAds);
  };
})();
