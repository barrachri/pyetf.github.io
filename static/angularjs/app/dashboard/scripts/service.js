'use strict';

// --- ApiService --- //

// getAPI: get a json with user's portfolios
// updatePortfolio: update data.portfolios with a new value
// savePortfolio: save the new portfolio a get the new portfolios list

dashboardApp.factory('ApiService', [
    '$http',
    '$log',
    '$location',
    function($http, $log, $location) {

        var service = {};

        // HTTP.GET service to get the current user information
        service.get = function(url) {
            return $http.get(options.api.base_url + url)
                .then(function(response) {
                    // Return the data response
                    return response;
                })
        };

        service.post = function(url, value) {
            return $http.post(options.api.base_url + url, {
                    data: value
                })
                .then(function(response) {
                    // Return the data response
                    return response;
                })
        };

        service.put = function(url, value) {
            return $http.put(options.api.base_url + url, {
                    data: value
                })
                .then(function(response) {
                    // Return the data response
                    return response;
                })
        };

        // HTTP.GET service to get the current user information
        service.delete = function(url) {
            return $http.delete(options.api.base_url + url)
                .then(function(response) {
                    // Return the data response
                    return response
                })
        };

        return service
    }
]);


// --- PortfolioService --- //

dashboardApp.factory('PortfolioService', [
    '$q',
    '$log',
    '$location',
    'ApiService',
    function($q, $log, $location, ApiService) {

        var service = {};
        var data = {};
        var data_mirror = {};
        data.portfolios = false;

        // update the locale data.user
        service.updatePortfolio = function() {
            ApiService.get('/portfolios').then(function(response) {
                data.portfolios = response.data.portfolios;
                data.performance = response.data.performance;
                data.best_etf = response.data.best_etf;
                data_mirror.portfolios = angular.copy(data.portfolios);
                data_mirror.performance = angular.copy(data.performance);
                data_mirror.best_etf = angular.copy(data.best_etf);
            })
        };

        // Service to update user information
        service.savePortfolio = function(value) {
            return ApiService.post('/portfolios', value)
            .then(function(response) {
                    // Get and update the portfolios
                    ApiService.get('/portfolios')
                    .then(function(response) {
                        data.portfolios = response.data.portfolios;
                    })
                    return response.data;
                })
        };

        service.getPortfolios = function() {

            var deferred = $q.defer();

            if (data.portfolios === false) {

                ApiService.get('/portfolios')
                .then(function(response) {
                    data.performance = response.data.performance;
                    data.portfolios = response.data.portfolios;
                    data.best_etf = response.data.best_etf;
                    deferred.resolve();
                })
            } else {
                deferred.resolve();
            }
            return deferred.promise;
        };

        service.removePortfolio = function(id, index_portfolio) {
            // Remove the selected portfolio from data and db
            return ApiService.delete('/portfolios/' + id)
            .then(function(response) {
                data.portfolios.splice(index_portfolio, 1);
                $location.path("/");
            }, function(response) {
                return response;
            })
        };

        service.removeEtf = function(portfolio) {
            // Remove the selected portfolio from data and db
            return ApiService.delete('/portfolios/' + portfolio.id + "/etfs/" + portfolio.etf_id)
            .then(function(response) {
                // Get and update the portfolios
                ApiService.get('/portfolios').then(function(response) {
                    data.portfolios = response.data.portfolios;
                    data_mirror.portfolios = angular.copy(data.portfolios);
                })
            }, function(error) {
                return error;
            })
        };

        service.addEtf = function(etf, portfolio_id) {
            // Add a new etf to a portfolio
            return ApiService.post('/portfolios/' + portfolio_id, etf)
            .then(function(response) {
                // Get and update the portfolios
                return response.data;
            })
        };

        service.updateEtf = function(etf, portfolio_id) {
            // Add a new etf to a portfolio
            return ApiService.put('/portfolios/' + portfolio_id, etf)
            .then(function(response) {
                // Get and update the portfolios
                ApiService.get('/portfolios').then(function(response) {
                    data.portfolios = response.data.portfolios;
                    data_mirror.portfolios = angular.copy(data.portfolios);
                })
            }, function(response) {
                return response;
            })
        };

        service.sellEtf = function(portfolio_id, ticker, etf_id, quantity , sell_price) {
            // Add a new etf to a portfolio
            var data = {ticker:ticker, quantity: quantity, price:sell_price, action: 0}
            return ApiService.post('/portfolios/' + portfolio_id + "/etfs/" + etf_id, data)
            .then(function(response) {
                // Get and update the portfolios
                ApiService.get('/portfolios').then(function(response) {
                    data.portfolios = response.data.portfolios;
                    data_mirror.portfolios = angular.copy(data.portfolios);
                })
            })
        };

        service.createMirror = function() {
            // Add a new etf to a portfolio
            data_mirror.portfolios = angular.copy(data.portfolios);
            return data_mirror;
        };

        return {
            service: service,
            data: data
        }
    }
]);

// --- UserService --- //

dashboardApp.factory('UserService', [
    '$log',
    '$window',
    '$q',
    'ApiService',
    function($log, $window, $q, ApiService) {

        var service = {};
        var data = {}
        data.user = false;
        data.messages = [];

        // update the locale data.user
        function updateUser(value) {
            data.user = value;
        };

        service.getUser = function() {
            // Set current user s
            var deferred = $q.defer();

            if (data.user === false) {

                ApiService.get('/users')
                .then(function(response) {
                    data.user = response.data;
                    deferred.resolve(data.user);
                })
            } else {
                deferred.resolve(data.user);
            }
            return deferred.promise;
        };

        // Service to update user information
        service.saveUser = function(user) {
            return ApiService.put('/users', user)
            .then(function(response) {
                    updateUser(response.data);
                }, function(error) {
                    return error;
                })
        };

        service.logOut = function() {
            $window.sessionStorage.removeItem('token');
            $window.sessionStorage.removeItem('jti');
            $window.location.href = "https://www.etfy.in" + '/#/login';
        };

        return {
            service: service,
            data: data
        }
    }
]);


// --- StatusService --- //

angular.module('angularjsApp')
    .factory('StatusService', function() {
        var data = {};
        data.AddPortfolio = false;

        return {
            setUser: function(user) {
                data.user = user;
            },
            getUser: function() {
                if (data.user) {
                    return data.user;
                } else {
                    return false;
                }
            },
            statusAddPortfolio: function() {

                return data.AddPortfolio;

            },
            changeAddPortfolio: function() {
                data.AddPortfolio = !data.AddPortfolio;
            }

        }
    });

// --- StreamHandler --- //

dashboardApp.factory('StreamHandler', [
    '$http',
    '$window',
    'UserService',
    'PortfolioService',
    '$log',
    function($http, $window, UserService, PortfolioService, $log) {

        var MessageStream;

        var StreamHandler = {

            set: function() {
                var jti = $window.sessionStorage.jti;
                var source = new EventSource(options.api.base_url + '/stream?jti=' + jti);
                MessageStream = source;
            },

            get: function(scope) {
                var source = MessageStream;
                source.addEventListener('message', function(event) {
                    scope.$apply(function() {
                        var data = JSON.parse(event.data)
                        if (data.error == "TokenExpire") {
                            UserService.service.logOut();
                        } else {
                            // update pt list
                            PortfolioService.service.updatePortfolio();
                            scope.messages.push(data);

                        }

                    });
                }, false);
            },
            close: function() {
                // Verify if a Stream exist
                if (MessageStream) {
                    var source = MessageStream;
                    source.close();
                }
            }
        };

        return StreamHandler;
    }
]);

dashboardApp.factory('TokenInterceptor', function($q, $window) {
    return {
        'request': function(config) {
            if ($window.sessionStorage.token) {
                config.headers.Authorization = $window.sessionStorage.token;
            }
            return config;
        },

        'requestError': function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        'response': function(response) {
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
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


