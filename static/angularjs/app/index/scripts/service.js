'use strict';


// --- loginService --- //

indexApp.factory('loginService', ['$http', '$log', '$window', '$q', function ($http, $log, $window, $q) {

  function Login(user){
    var deferred = $q.defer();
    $http.post(options.api.base_url +'/auth/login', {user: user})
    .success(function(data, status) {
      if (data.token) {
        // deferred.resolve({title: data.title, cost: data.price});
        $log.info('JTI: ' + data.jti, 'TOKEN: ' + data.token);
        $window.sessionStorage.setItem('token', data.token);
        $window.sessionStorage.setItem('jti', data.jti);
        $window.location.href = '/account/';                
      } else {
        deferred.reject(data);
        $window.sessionStorage.removeItem('token');
        $log.error(data, status);
      }
    }).error(function(data, status) {
      deferred.reject(data);
      $window.sessionStorage.removeItem('token');
      $log.error(data, status);
    });
    return deferred.promise;
  };
  return Login
}]);

// --- signupService --- //

indexApp.factory('signupService', ['$http', '$log', '$window', '$q', function ($http, $log, $window, $q) {

  function Signup(user){
    var deferred = $q.defer();
    $http.post(options.api.base_url +'/signup', {user: user})
    .success(function(data) {
      if (data.token) {
        $log.info('JTI: ' + data.jti, 'TOKEN: ' + data.token);
        $window.sessionStorage.setItem('token', data.token);
        $window.sessionStorage.setItem('jti', data.jti);
        $window.location.href = '/account/';                
      } else {
        deferred.reject(data);
        $window.sessionStorage.removeItem('token');
        $log.error(data, status);
      }
    }).error(function(data, status) {
      deferred.reject(data);
      $window.sessionStorage.removeItem('token');
      $log.error(data, status);
    });
    return deferred.promise;
  };
  return Signup
}]);

// --- resetPasswordService --- //

indexApp.factory('resetPasswordService', ['$http', '$log', '$window', '$q', function ($http, $log, $window, $q) {

  function ResetPassword(user){
    var deferred = $q.defer();
    $http.post(options.api.base_url +'/auth/resetpassword', {user: user})
    .success(function(data) {
                          
        deferred.reject(data);
        $log.error(data, status);
      
    }).error(function(data, status) {
      deferred.reject(data);
      $log.error(data, status);
    });
    return deferred.promise;
  };
  return ResetPassword
}]);

// --- saveResetPasswordService --- //

indexApp.factory('saveResetPasswordService', ['$http', '$log', '$window', '$q', '$timeout', function ($http, $log, $window, $q, $timeout) {

  function saveResetPassword(user){
    var deferred = $q.defer();
    $http.post(options.api.base_url +'/auth/verifytoken', {user: user})
    .success(function(data,status) {

      if (data.token) {
        // deferred.resolve({title: data.title, cost: data.price});
        $log.info('JTI: ' + data.jti, 'TOKEN: ' + data.token);
        $window.sessionStorage.setItem('token', data.token);
        $window.sessionStorage.setItem('jti', data.jti);
        deferred.resolve({code: data.code, type: data.type});
        $timeout(function() {
            $window.location.href = '/account/';
          }, 5000);
                        
      } else {
        deferred.reject(data,status);
        $window.sessionStorage.removeItem('token');
        $log.error(data, status);
      }
      
    }).error(function(data, status) {

      deferred.reject(data);
      $log.error(data, status);

    });
    return deferred.promise;
  };
  return saveResetPassword
}]);