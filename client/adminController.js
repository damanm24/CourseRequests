angular.module('myApp').controller('adminController',
    ['$scope', '$location', 'AuthService', 'CoursesService',
        function ($scope, $location, AuthService, CoursesService) {
            $scope.user = null;
            $scope.requests = null;
            $scope.requestToView = null;
            $scope.login = function () {

                // initial values
                $scope.error = false;
                $scope.disabled = true;

                // call login from service
                AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                    // handle success
                    .then(function () {
                        $scope.user = AuthService.getUser();
                        $location.path('/one');
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
                CoursesService.getAllCourseRequests().then(function (data) {
                    console.log(data);
                    $scope.requests = data.response;
                    $scope.requests.forEach(function (element) {
                        try {
                            element.request = JSON.parse(element.request);
                        } catch (err) {}
                    });
                })
            }

            $scope.test = function () {
                $scope.currentRequest = CoursesService.getCurrentRequest();
                $scope.currentRequest = JSON.parse($scope.currentRequest.response.request);
                console.log($scope.currentRequest.accepted);
            }

            $scope.show = function (request) {
                CoursesService.setRequest(request);
                $location.path('/update');
            }

            $scope.render = function () {
                $scope.requestToView = CoursesService.getCurrentRequest();
            }

            $scope.submit = function () {
                delete $scope.requestToView.$$hashKey;
                delete $scope.requestToView.request.$$hashKey;
                $scope.requestToView.request.reviewed = true;
                CoursesService.updateRequestById($scope.requestToView._id, $scope.requestToView).then(function (data) {
                    $scope.requests = data.response;
                    $scope.requests.forEach(function (element) {
                        try {
                            element.request = JSON.parse(element.request);
                        } catch (err) {}
                    });
                });
                $location.path('/admin');
            }

        }]);