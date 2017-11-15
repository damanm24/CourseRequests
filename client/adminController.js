angular.module('myApp').controller('adminController',
    ['$scope', '$location', 'AuthService',
        function ($scope, $location, AuthService) {
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
                AuthService.getAllCourseRequests().then(function (data) {
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
                $scope.currentRequest = AuthService.getCurrentRequest();
                $scope.currentRequest = JSON.parse($scope.currentRequest.response.request);
                console.log($scope.currentRequest.accepted);
            }

            $scope.show = function (request) {
                AuthService.setRequest(request);
                $location.path('/update');
            }

            $scope.render = function () {
                $scope.requestToView = AuthService.getCurrentRequest();
            }

            $scope.submit = function () {
                delete $scope.requestToView.$$hashKey;
                delete $scope.requestToView.request.$$hashKey;
                $scope.requestToView.request.reviewed = true;
                AuthService.updateRequestById($scope.requestToView._id, $scope.requestToView).then(function (data) {
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