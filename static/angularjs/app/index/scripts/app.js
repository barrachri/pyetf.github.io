'use strict';

/**
 * @ngdoc overview
 * @name indexApp
 * @description
 * # angularjsApp
 *
 * Main module of the application.
 */

var options = {};
options.api = {};
//options.api.base_url = "http://localhost:5000";
options.api.base_url = "https://api.etfy.in";

var indexApp = angular
  .module('indexApp', [
    'ngRoute',
  ]);

  indexApp.config(function ($routeProvider) {
    $routeProvider

      // account home page
      .when('/', {
        templateUrl: '/static/angularjs/app/index/views/main.html',
        controller: 'MainCtrl'
      })
      //
      .when('/signup', {
        templateUrl: '/static/angularjs/app/index/views/signup.html',
        controller: 'SignupCtrl'
      })
      // account home page
      .when('/login', {
        templateUrl: '/static/angularjs/app/index/views/login.html',
        controller: 'LoginCtrl'
      })
      // ETF page
      .when('/resetpassword', {
        templateUrl: '/static/angularjs/app/index/views/reset.html',
        controller: 'ResetPasswordCtrl'
      })
      .when('/verifytoken/:token', {
        templateUrl: '/static/angularjs/app/index/views/reset_confirm.html',
        controller: 'VerifyTokenCtrl'
      })
      // account home page
      .otherwise({
        redirectTo: '/'
      });
  }); 

indexApp.run(function($rootScope, $location, $anchorScroll, $routeParams) {
  //when the route is changed scroll to the proper element.
  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    $location.hash($routeParams.scrollTo);
    $anchorScroll();  
  });
});

