var myApp = angular.module('myApp', ['ngRoute', 'ngCookies']);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/home', {
      templateUrl: 'partials/home.html',
      access: { restricted: true }
    })
    .when('/login', {
      templateUrl: 'partials/login.html',
      controller: 'loginController',
      access: { restricted: false }
    })
    .when('/logout', {
      controller: 'logoutController',
      access: { restricted: true }
    })
    .when('/register', {
      templateUrl: 'partials/register.html',
      access: { restricted: false }
    })
    .when('/one', {
      templateUrl: 'partials/list.html',
      access: { restricted: true }
    })
    .when('/save', {
      templateUrl: 'partials/save.html',
      access: { restricted: true }
    })
    .when('/status', {
      templateUrl: 'partials/status.html',
      access: { restricted: true }
    })
    .when('/admin', {
      templateUrl: 'partials/listview.html',
      access: { restricted: false }
    })
    .when('/update', {
      templateUrl: 'partials/update.html',
      access: { restricted: false }
    })
    .otherwise({
      redirectTo: '/home'
    });
});

myApp.run(function ($rootScope, $location, $route, $cookies, AuthService, CoursesService) {
  $rootScope.$on('$routeChangeStart',
    function (event, next, current) {
      AuthService.getUserStatus()
        .then(function () {
          if (next.access.restricted && !AuthService.isLoggedIn()) {
            $location.path('/login');
            $route.reload();
          }
        });
    });
});