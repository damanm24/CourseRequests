angular.module('myApp').factory('courseService',
  ['$q', '$timeout', '$http',
    function ($q, $timeout, $http) {

      // return available functions for use in the controllers
      return ({
        getCourses: getCourses
      });

      function getCourses() {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.get('/courses/getCourses')
          // handle success
          .success(function (data) {
            if (data) {
              console.log(data);
              deferred.resolve(data);
            } else {
              deferred.reject();
            }
          })
          // handle error
          .error(function (data) {
            deferred.reject();
          });

        // return promise object
        return deferred.promise;
      }
    }]);