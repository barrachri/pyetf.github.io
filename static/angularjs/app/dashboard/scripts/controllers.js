'use strict';

/**
 * @ngdoc function
 * @name angularjsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularjsApp
 */

dashboardApp.controller('UserCtrl', [
    '$scope',
    'UserService',
    'StreamHandler',
    function($scope, UserService, StreamHandler) {

        // Get the current user
        UserService.service.getUser().then(function() {
            $scope.data = UserService.data;
        });

        // Call the logOut function and close the stream event
        $scope.logOut = function() {
            StreamHandler.close();
            UserService.service.logOut();
        }

    }
]);

dashboardApp.controller('portfolio_add_box', [
    '$scope',
    'StatusService',
    'PortfolioService',
    'UserService',
    function($scope, StatusService, PortfolioService, UserService) {

        // Save the changed Portfolios object
        $scope.savePortfolio = function(portfolio) {
            PortfolioService.service.savePortfolio(portfolio)
                .then(function(data) {
                    $scope.message = data;
                    UserService.data.messages.push(data);
                }, function(error) {
                    UserService.data.messages.push(error.data);
                    $scope.message = error.data;
                })
        };

        $scope.$watch(StatusService.statusAddPortfolio, function() {
            $scope.add_portfolio_box = StatusService.statusAddPortfolio();
        });
        $scope.change_add_portfolio_box = StatusService.changeAddPortfolio;
    }
]);

dashboardApp.controller('MsgCtrl', [
    '$scope',
    'StreamHandler',
    'UserService',
   function($scope, StreamHandler, UserService) {

        $scope.messages = UserService.data.messages;
        StreamHandler.set();
        StreamHandler.get($scope);

        $scope.closeMsg = function(id) {
            $scope.messages.splice(id,1);
        };
    }
]);

dashboardApp.controller('MainCtrl', [
    '$scope',
    '$routeParams',
    'PortfolioService',
    function($scope, $routeParams, PortfolioService) {

        $scope.edit = false;
        $scope.header = "Dashboard";
        $scope.id_pt = $routeParams.id;

        // Create a copy of the portfolios object
        PortfolioService.service.getPortfolios().then(function() {
            $scope.data = PortfolioService.data;
            $scope.data_chart = [];
            $scope.pie_data = [];
            var data_pie_total = 0;
            var temp_list = {};



    for(var i=0; i<$scope.data.portfolios.length; i++) {

    $scope.data_chart.push({label:$scope.data.portfolios[i].name, value:$scope.data.portfolios[i].performance});

    for(var j=0; j<$scope.data.portfolios[i].etfs.length; j++)
    {
        data_pie_total += $scope.data.portfolios[i].etfs[j].total;

        if ($scope.data.portfolios[i].etfs[j].ticker in temp_list)
            {
                temp_list[$scope.data.portfolios[i].etfs[j].ticker] += $scope.data.portfolios[i].etfs[j].total;
            }
        else
            {
                temp_list[$scope.data.portfolios[i].etfs[j].ticker] = $scope.data.portfolios[i].etfs[j].total;
            }
    }

}

$scope.pts_total = data_pie_total;


for (i in temp_list) {
  $scope.pie_data.push({"key": i, "y": temp_list[i]/data_pie_total});
}



$scope.hor_bar_options = {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 40
                },
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.2f')(d);
                },
                transitionDuration: 500,
                xAxis: {
                    axisLabel: 'Portfolios'
                },
                yAxis: {
                    axisLabel: 'Performance (%)',
                    axisLabelDistance: 30
                }
            }
        };

$scope.hor_bar_data = [
                 {
                     "key": "Series 1",
                     "values": $scope.data_chart
                 }
             ];
        });

 $scope.pie_options = {
            chart: {
                type: 'pieChart',
                height: 450,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                valueFormat: function(d){
                    return d3.format('%,.2f')(d);
                },

                showLabels: true,
                transitionDuration: 500,
                labelThreshold: 0.01,
                legend: {
                    margin: {
                        top: 20,
                        right: 20,
                        bottom: 20,
                        left: 20
                    }
                }
            }
        };


    }

]);

dashboardApp.controller('ProfileCtrl', [
    '$scope',
    '$http',
    'StatusService',
    'UserService',
    function($scope, $http, StatusService, UserService) {

        $scope.header = "Profile";
        $scope.password = {};

        // Create a copy of the user object
        UserService.service.getUser().then(function(data) {
            $scope.edit_user = angular.copy(UserService.data)
        });

        // Check if the user object was changed
        $scope.isUnchanged = function() {
            return angular.equals($scope.edit_user, UserService.data);
        };

        // Save the changed user object
        $scope.saveItem = function() {
            UserService.service.saveUser($scope.edit_user.user)
        };

        // Check if the passwords are equals
        $scope.passwordEquals = function() {
            return angular.equals($scope.password.password1, $scope.password.password2);
        };

        $scope.savePassword = function() {
            $http
                .put(options.api.base_url + '/users', {
                    data: $scope.password
                })
                .success(function(data, status, headers, config) {
                    $scope.passwordFormerror = data;
                })
                .error(function(data, status, headers, config) {
                    console.log("ERROR");
                    $scope.passwordFormerror = data;
                    console.log($scope.passwordFormerror);
                });
        };
    }
]);

dashboardApp.controller('ListCtrl', [
    '$scope',
    'PortfolioService',
    'StatusService',
    function($scope, PortfolioService, StatusService) {

        $scope.add_portfolio_box = StatusService.statusAddPortfolio();
        $scope.change_add_portfolio_box = StatusService.changeAddPortfolio;

        // Create a copy of the user object
        PortfolioService.service.getPortfolios().then(function() {
            $scope.data = PortfolioService.data;
        });
    }
]);

dashboardApp.controller('BacktestCtrl', [
    '$scope',
    '$http',
    'StatusService',
    'UserService',
    'PortfolioService',
    function($scope, $http, StatusService, UserService, PortfolioService) {

        $scope.header = "Backtest";

        $scope.add_portfolio_box = StatusService.statusAddPortfolio();
        $scope.change_add_portfolio_box = StatusService.changeAddPortfolio;

        // Create a copy of the user object
        PortfolioService.service.getPortfolios().then(function() {
            $scope.data = PortfolioService.data;
        });
    }
]);



dashboardApp.controller('PortfolioCtrl', [
    '$routeParams',
    '$scope',
    '$http',
    '$window',
    'PortfolioService',
    'UserService',
    function($routeParams, $scope, $http, $window, PortfolioService, UserService) {

        $scope.edit = {toggle : false};
        $scope.header = "Portfolio";

        // Check for the element that has portfolios.id equals to $routeParams.id
        // and get its array index
        // Then create a mirror object ($scope.prev_portfolio)
        // to check for changes

        PortfolioService.service.getPortfolios().then(function() {

            for (var i = 0; i < PortfolioService.data.portfolios.length; i++) {
                if (PortfolioService.data.portfolios[i].id == $routeParams.id) {
                    $scope.index_portfolio = i;
                    $scope.data = PortfolioService.data; // anche questo da rivedere
                    $scope.data_mirror = PortfolioService.service.createMirror(); // credo non serva !

                    $scope.isUnvalid = function(sell,quantity, price) {
                        if (sell >= 1 && sell <= quantity && price > 0)
                            {return false}

                        else
                            {return true}
                    };
                }
            }

        });

        // function to add a new etf to a portfolio
        $scope.addetf = function(etf) {
            etf.action = 1;
            PortfolioService.service.addEtf(etf, $routeParams.id)
                .then(function(data) {
                    $scope.message = data;
                    UserService.data.messages.push(data);
                }, function(error) {
                    $scope.message = data;
                    UserService.data.messages.push(error.data);
                });
        };

      /*  $scope.reset = function() {
            $scope.data_mirror = PortfolioService.service.createMirror();
            $scope.edit.toggle = false;
        };

        */
        // Sell ETFs
        $scope.saveItem = function(ticker, etf_id, quantity ,sell_price) {
            /*
            var portfolio_to_save = [];
            for (var i = 0; i < $scope.data_mirror.portfolios[$scope.index_portfolio].etfs.length; i++) {
                if (!angular.equals($scope.data_mirror.portfolios[$scope.index_portfolio].etfs[i], $scope.data.portfolios[$scope.index_portfolio].etfs[i])) {
                    portfolio_to_save.push($scope.data_mirror.portfolios[$scope.index_portfolio].etfs[i]);
                }
            }; */
            PortfolioService.service.sellEtf($routeParams.id, ticker, etf_id, quantity ,sell_price)
                .then(function(data) {
                    $scope.edit.toggle = false;
                    UserService.data.messages.push(data);
                }, function(error) {
                    $scope.message = error.data;
                    UserService.data.messages.push(error.data);
                });



        };


        $scope.removeEtf = function(etf) {
            var portfolio = {};
            portfolio.id = $routeParams.id;
            portfolio.array_index = $scope.index_portfolio;
            portfolio.etf_id = etf;

            if ($window.confirm("Are you sure about remove this ETF ?")) {

                PortfolioService.service.removeEtf(portfolio).then(function() {}, function(data) {
                    $scope.message = data;
                });

            };
        };

        $scope.removePortfolio = function(id) {
            if ($window.confirm("You are removing this portfolio, every etf inside this portfolio will be remove. Are you sure ?")) {
                PortfolioService.service.removePortfolio(id, $scope.index_portfolio).catch(function(data) {
                });
            };
        };

    }
]);
