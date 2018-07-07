'use strict';

(function () {

  var TIMEOUT = 10000;
  var SERVER_CODE_OK = 200;

  /**
   * Создаем ajax-запрос к серверу
   * @param  {String} method
   * @param  {Any} data
   * @param  {String} url
   * @param  {Function} onLoad
   * @param  {Function} onError
   */
  var accessSever = function (method, data, url, onLoad, onError) {

    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === SERVER_CODE_OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;

    xhr.open(method, url);

    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  /**
   * Отправляем данные на сервер POST-запросом
   * @param  {String} url
   * @param  {Any} data
   * @param  {Function} onLoad
   * @param  {Function} onError
   */
  var postData = function (url, data, onLoad, onError) {
    accessSever('POST', data, url, onLoad, onError);
  };

  /**
   * Получаем данные от сервера GET-запросом
   * @param  {String} url
   * @param  {Function} onLoad
   * @param  {Function} onError
   */
  var getData = function (url, onLoad, onError) {
    accessSever('GET', false, url, onLoad, onError);
  };

  window.backend = {
    postData: postData,
    getData: getData
  };
})();
