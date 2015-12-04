'use strict';

/**
 * @ngdoc overview
 * @name angularjsApp
 * @description
 * # angularjsApp
 *
 * Main module of the application.
 */

var options = {};
options.api = {};
//options.api.base_url = "http://localhost:5000";
options.api.base_url = "https://api.etfy.in";

var dashboardApp = angular
  .module('angularjsApp', [
    'ngRoute',
    'nvd3'
  ]);

  dashboardApp.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push(function($q, $window) {
    return {
     'request': function(config) {
         // same as above
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.x_access_token = $window.sessionStorage.token;
      }
      return config;
    },
    'responseError': function(rejection) {
            if (rejection != null && rejection.status === 401 && $window.sessionStorage.token) {
                $window.sessionStorage.removeItem('token');
                $window.sessionStorage.removeItem('jti');
                $window.location.href = "https://www.etfy.in" + '/#/login';
            }

            return $q.reject(rejection);
        }
    };
  });
  }]);

  dashboardApp.config(function ($routeProvider) {
    $routeProvider

      // account home page
      .when('/', {
        templateUrl: '/static/angularjs/app/dashboard/views/main.html',
        controller: 'MainCtrl'
      })
      //
      .when('/about', {
        templateUrl: '/static/angularjs/app/dashboard/views/about.html',
        controller: 'AboutCtrl'
      })
      // ETF page
      .when('/etfs/:ticker', {
        templateUrl: '/static/angularjs/app/dashboard/views/ticker.html',
        controller: 'TickerCtrl'
      })
      // portfolio page
      .when('/portfolios/:id', {
        templateUrl: '/static/angularjs/app/dashboard/views/portfolio.html',
        controller: 'PortfolioCtrl'
      })      
      // profile page
      .when('/profile', {
        templateUrl: '/static/angularjs/app/dashboard/views/profile.html',
        controller: 'ProfileCtrl'
      })
      // backtest page
      .when('/backtest', {
        templateUrl: '/static/angularjs/app/dashboard/views/backtest.html',
        controller: 'BacktestCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

  dashboardApp.run(function($rootScope, $location, $window) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        //redirect only if both isAuthenticated is false and no token is set
        if (!$window.sessionStorage.token) {

            $window.location.href = "https://www.etfy.in" + '/#/login'; 
        }
    });
}); 


