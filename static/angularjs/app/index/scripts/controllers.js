'use strict';

/**
 * @ngdoc overview
 * @name angularjsApp
 * @description
 * # angularjsApp
 *
 * Main module of the application.
 */

// --- MainCtrl --- //

indexApp.controller('MainCtrl', [ 
  function () {

    
  }]);

// --- LoginCtrl --- //

indexApp.controller('LoginCtrl', [
  '$scope',
  'loginService',
  function ($scope, loginService) {

    $scope.login = function() {
      loginService($scope.user).catch(function(data){
        $scope.loginError = data;
      });
    }
  }]);

// --- SignupCtrl --- //

indexApp.controller('SignupCtrl', [
  '$scope',
  'signupService', 
  function ($scope, signupService) {
    $scope.user = {};
    $scope.passwordEquals = function() {
      return angular.equals($scope.user.password, $scope.user.password2);
    };
    $scope.signup = function() {

      signupService($scope.user).catch(function(data){
        $scope.signupError = data;
      });
    };
  }]);

// --- ResetPasswordCtrl --- //

indexApp.controller('ResetPasswordCtrl', [
  '$scope',
  'resetPasswordService', 
  function ($scope, resetPasswordService) {
    $scope.user = {};

    $scope.resetPassword = function() {

      resetPasswordService($scope.user).then(function(data){
        $scope.resetpasswordError = data;
      },
      function(data){
        $scope.resetpasswordError = data;
      });
    };
  }]);

indexApp.controller('VerifyTokenCtrl', [
  '$scope',
  '$routeParams',
  'saveResetPasswordService', 
  function ($scope,$routeParams, saveResetPasswordService) {
    $scope.user = {};
    $scope.user.token = $routeParams.token;

    $scope.passwordEquals = function() {
      return angular.equals($scope.user.password, $scope.user.password2);
    };

    $scope.saveResetPassword = function() {

      saveResetPasswordService($scope.user).then(function(data){
        $scope.resetPasswordError = data;
      },
      function(data){
        $scope.resetPasswordError = data;
      });
    };
  }]);