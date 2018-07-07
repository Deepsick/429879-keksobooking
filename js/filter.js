'use strict';

(function () {

  var DEFAULT_SELECT_VALUE = 'any';

  var Price = {
    MIN: 10000,
    MAX: 50000
  };

  var checkPrice = {
    low: function (value) {
      return value < Price.MIN;
    },
    middle: function (value) {
      return value >= Price.MIN && value <= Price.MAX;
    },
    high: function (value) {
      return value > Price.MAX;
    }
  };


  var filterState = {
    type: DEFAULT_SELECT_VALUE,
    price: DEFAULT_SELECT_VALUE,
    rooms: DEFAULT_SELECT_VALUE,
    guests: DEFAULT_SELECT_VALUE,
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
      var checkedItems = [];

      if (filterState.type !== DEFAULT_SELECT_VALUE) {
        checkedItems.push(filterState.type === ad.offer.type);
      }

      if (filterState.rooms !== DEFAULT_SELECT_VALUE) {
        checkedItems.push(+filterState.rooms === ad.offer.rooms);
      }

      if (filterState.guests !== DEFAULT_SELECT_VALUE) {
        checkedItems.push(+filterState.guests === ad.offer.guests);
      }

      if (filterState.price !== DEFAULT_SELECT_VALUE) {
        checkedItems.push(checkPrice[filterState.price](ad.offer.price));
      }

      if (filterState.features.length > 0) {
        var answer = window.utils.checkEqualityOfArrays(filterState.features, ad.offer.features);
        checkedItems.push(answer);
      }

      return checkedItems.every(function (isValid) {
        return isValid;
      });
    });

    return filteredAds;
  };

  var filterSelects = ['type', 'price', 'rooms', 'guests'];

  /**
   * Возвращаем состояние filterState по умолчанию
   */
  var resetFilterState = function () {
    filterSelects.forEach(function (category) {
      filterState[category] = DEFAULT_SELECT_VALUE;
    });
    filterState.features.splice(0, filterState.features.length);
  };

  var filterForm = document.querySelector('.map__filters');

  filterForm.addEventListener('change', function (changeEvt) {
    updateFilterState(changeEvt);
    var filteredArray = getFilteredArray();
    window.pins.updatePins(filteredArray);
  });

  window.filter = {
    resetFilterState: resetFilterState
  };
})();
