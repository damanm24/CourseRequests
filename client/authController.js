angular.module('myApp').controller('loginController',
  ['$scope', '$location', 'AuthService', '$q', 'CoursesService',
    function ($scope, $location, AuthService, $q, CoursesService) {
      $scope.user = null;
      $scope.courses = null;
      $scope.requests = [];
      $scope.login = function () {

        // initial values
        $scope.error = false;
        $scope.disabled = true;

        // call login from service
        AuthService.login($scope.loginForm.username, $scope.loginForm.password)
          // handle success
          .then(function () {
            $scope.user = AuthService.getUser();
            $location.path('/');
            $scope.disabled = false;
            $scope.loginForm = {};
          })
          // handle error
          .catch(function () {
            $scope.error = true;
            $scope.errorMessage = "Invalid username and/or password";
            $scope.disabled = false;
            $scope.loginForm = {};
          });

      };

      $scope.update = function () {
        $scope.requests = [];
        $scope.user = AuthService.getUser();
        CoursesService.getCourses().then(function (data) {
          CoursesService.editCourses(data).then(function (result) {
            $scope.courses = result;
          })
        });
      }

      $scope.orderByMe = function (x) {
        $scope.myOrderBy = x;
      }

      $scope.add = function (course) {
        $scope.user = AuthService.getUser();
        $scope.requests.push(course);
        var index = $scope.courses.indexOf(course);
        $scope.courses.splice(index, 1);
      }

      $scope.save = function () {
        CoursesService.saveRequestSession($scope.requests, $scope.courses);
        $location.path('/save');
      }

      $scope.persist = function () {
        $scope.requests = CoursesService.getCurrentRequest();
      }

      $scope.remove = function (course, index) {
        $scope.courses.unshift($scope.requests[index]);
        $scope.requests.splice(index, 1);
      }

      $scope.submit = function () {
        var coursesPrep = {
          fall: [],
          winter: [],
          spring: [],
          year: []
        };
        $scope.requests.forEach(function (elem) {
          if (elem.term_id == 1) {
            coursesPrep.fall.push(elem);
          } else if (elem.term_id == 2) {
            coursesPrep.winter.push(elem);
          } else if (elem.term_id == 3) {
            coursesPrep.spring.push(elem);
          } else {
            coursesPrep.year.push(elem);
          }
        });
        coursesPrep.comments = $scope.requests.comments;
        coursesPrep.accepted = "maybe";
        coursesPrep.reviewed = false;
        CoursesService.submit(coursesPrep);
        $location.path('/status')
      }
    }]);

angular.module('myApp').controller('logoutController',
  ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {

      $scope.logout = function () {

        // call logout from service
        AuthService.logout()
          .then(function () {
            $location.path('/login');
          });

      };

    }]);

angular.module('myApp').controller('registerController',
  ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {

      $scope.register = function () {

        // initial values
        $scope.error = false;
        $scope.disabled = true;

        // call register from service
        AuthService.register($scope.registerForm.username, $scope.registerForm.password, $scope.registerForm.firstname, $scope.registerForm.lastname, $scope.registerForm.gradyear)
          // handle success
          .then(function () {
            $location.path('/login');
            $scope.disabled = false;
            $scope.registerForm = {};
          })
          // handle error
          .catch(function () {
            $scope.error = true;
            $scope.errorMessage = "Something went wrong!";
            $scope.disabled = false;
            $scope.registerForm = {};
          });

      };

    }]);