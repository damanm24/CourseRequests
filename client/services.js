angular.module('myApp').factory('AuthService',
  ['$q', '$timeout', '$http',
    function ($q, $timeout, $http) {

      // create user variable
      var user = null;
      var currentUser = null;
      var courses = null;
      var request = null;
      var editedCourses = null;

      // return available functions for use in the controllers
      return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        logout: logout,
        register: register,
        getUser: getUser,
        returnCourses: returnCourses,
        editCourses: editCourses,
        getCourses: getCourses,
        saveRequestSession: saveRequestSession,
        getCurrentRequest: getCurrentRequest,
        submit: submit,
        getRequestStatus: getRequestStatus,
        getAllCourseRequests: getAllCourseRequests,
        updateRequestById: updateRequestById,
        setRequest: setRequest
      });

      function setRequest(req) {
        request = req;
      }

      function updateRequestById(id, request) {
        // create a new instance of deferred
        var deferred = $q.defer();
        var json = JSON.stringify(request, function (key, value) {
          if (key === "$$hashKey") {
            return undefined;
          }

          return value;
        });

        // send a post request to the server
        $http.post('/user/updateRequest/' + id, { newRequest: json })
          // handle success
          .success(function (data) {
            if (data) {
              request = data;
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

      function getAllCourseRequests() {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.get('/user/getAllRequests')
          // handle success
          .success(function (data) {
            if (data) {
              request = data;
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

      function getRequestStatus() {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.get('/user/getRequestStatus')
          // handle success
          .success(function (data) {
            if (data) {
              request = data;
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

      function finalizeData(data) {
        var deferred = $q.defer()

        var toSend = {
          username: currentUser.username,
          request: data
        }

        deferred.resolve(toSend);
        return deferred.promise;
      }

      function submit(data) {
        var deferred = $q.defer();
        finalizeData(data).then(function (userToUpdate) {
          $http.post('/user/submit/' + currentUser.username, { newStudentObject: JSON.stringify(data) })
            .then(function (response) {
              currentUser = response;
            },
            function (response) {
              console.log(response);
            })
        })
        return deferred.promise;
      }

      function saveRequestSession(data, data1) {
        request = data;
        currentCourses = data1;
        console.log(request);
      }

      function getCurrentRequest() {
        if (getCurrentRequest) {
          return request;
        } else {
          return null;
        }
      }

      function isLoggedIn() {
        if (user) {
          return true;
        } else {
          return false;
        }
      }

      function getUser() {
        if (currentUser) {
          return currentUser;
        } else {
          return null;
        }
      }

      function returnCourses() {
        if (courses) {
          return courses;
        } else {
          getCourses().then(function (data) {
            return data
          });
        }
      }

      function editCourses(courses) {
        var deferred = $q.defer()

        var department_ids = {
          1: "English", 2: "Social Science", 3: "Mathematics", 4: "Science", 5: "Spanish", 6: "Fine and Performing Arts", 7: "Physical Education", 8: "Interdisciplinary Electives",
          9: "Non-academic Courses", 10: "Technology", 11: "Seminars"
        };
        var term_ids = { 1: "Fall", 2: "Winter", 3: "Spring", 4: "Year-long" };
        courses.forEach(function (element) {
          element.department_name = department_ids[element.department_id];
          element.term_name = term_ids[element.term_id];
        });



        deferred.resolve(courses);
        return deferred.promise;
      }

      function getCourses() {
        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.get('/courses/getCourses')
          // handle success
          .success(function (data) {
            if (data) {
              courses = data;
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

      function getUserStatus() {
        return $http.get('/user/status')
          // handle success
          .success(function (data) {
            if (data.status) {
              user = true;
              currentUser = data.user;
            } else {
              user = false;
            }
          })
          // handle error
          .error(function (data) {
            user = false;
          });
      }

      function login(username, password) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/user/login',
          { username: username, password: password })
          // handle success
          .success(function (data, status) {
            if (status === 200 && data.status) {
              user = true;
              currentUser = data.user;
              deferred.resolve();
            } else {
              user = false;
              deferred.reject();
            }
          })
          // handle error
          .error(function (data) {
            user = false;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;

      }

      function logout() {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a get request to the server
        $http.get('/user/logout')
          // handle success
          .success(function (data) {
            user = false;
            deferred.resolve();
          })
          // handle error
          .error(function (data) {
            user = false;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;

      }

      function register(username, password, firstname, lastname, gradyear) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/user/register',
          { username: username, password: password, firstname: firstname, lastname: lastname, gradyear: gradyear })
          // handle success
          .success(function (data, status) {
            if (status === 200 && data.status) {
              deferred.resolve();
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