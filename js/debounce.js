'use strict';

(function () {

  var DEBOUNCE_INTERVAL = 500;

  /**
   * Устраняем дребезг, вызывая функция fun не чаще, чем DEBOUNCE_INTERVAL мс
   * @param  {Function} fun
   * @return {Function}
   */
  window.debounce = function (fun) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
      }, DEBOUNCE_INTERVAL);
    };
  };
})();

