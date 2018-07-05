'use strict';

(function () {

  var priceHelper = {
    low: function (value) {
      return value < 10000;
    },
    middle: function (value) {
      return value >= 10000 && value <= 50000;
    },
    high: function (value) {
      return value > 50000;
    }
  };

  var defaultSelectValue = 'any';
  var filterState = {
    type: defaultSelectValue,
    price: defaultSelectValue,
    rooms: defaultSelectValue,
    guests: defaultSelectValue,
    features: []
  };

  /**
   * Обновляем значения наших фильтров в filterState
   * @param  {Object} evt
   */
  var updateFilterState = function (evt) {
    var target = evt.target;
    var changedCategory;
    if (target.nodeName.toLowerCase() === 'select') {
      changedCategory = target.id.split('-')[1];
      var newCategoryValue = target.options[target.selectedIndex].value;
      filterState[changedCategory] = newCategoryValue;
    }

    if (target.nodeName.toLowerCase() === 'input') {
      var feature = target.value;
      changedCategory = 'features';
      if (target.checked) {
        filterState[changedCategory].push(feature);
      } else {
        var index = filterState[changedCategory].indexOf(feature);
        filterState[changedCategory].splice(index, 1);
      }
    }
  };

  /**
   * Возвращаем отфильтрованный массив в соответствии с состоянием установленных
   * фильтров filterState
   * @return {Array}
   */
  var getFilteredArray = function () {
    var filteredAds = window.data.ads.filter(function (ad) {
      var checkingArray = [];

      if (filterState.type !== 'any') {
        checkingArray.push(filterState.type === ad.offer.type);
      }

      if (filterState.rooms !== 'any') {
        checkingArray.push(+filterState.rooms === ad.offer.rooms);
      }

      if (filterState.guests !== 'any') {
        checkingArray.push(+filterState.guests === ad.offer.guests);
      }

      if (filterState.price !== 'any') {
        checkingArray.push(priceHelper[filterState.price](ad.offer.price));
      }

      if (filterState.features.length > 0) {
        var answer = window.utils.arrayIncludesAnotherArray(filterState.features, ad.offer.features);
        checkingArray.push(answer);
      }

      return checkingArray.every(function (isValid) {
        return isValid;
      });
    });

    return filteredAds;
  };

  var filterForm = document.querySelector('.map__filters');

  filterForm.addEventListener('change', function (changeEvt) {
    updateFilterState(changeEvt);
    var filteredArray = getFilteredArray();
    window.pins.updatePins(filteredArray);
  });
})();
