// Ticket Info controller
    
dashboardApp.controller('TickerCtrl', [
    	'$scope',
    	'$routeParams',
    	'$http',
    	function ($scope, $routeParams, $http) {

  	$scope.get = function() {

    		// function to get the ticker data
  	$http.get(options.api.base_url + '/etfs/' + $routeParams.ticker)
  		.success(function(data, status, headers, config) {
  			console.log(data);
  			$scope.etf = data;
  			$scope.data_chart = {price: [], sma_30 : [], sma_100: [], sma_300: []}
  	for(var i=0; i<$scope.etf.data.length; i++) {

  	$scope.data_chart.price.push({x:Date.parse($scope.etf.data[i].date), y:$scope.etf.data[i].price});
  	$scope.data_chart.sma_30.push({x:Date.parse($scope.etf.data[i].date), y:$scope.etf.data[i].sma_30});
  	$scope.data_chart.sma_100.push({x:Date.parse($scope.etf.data[i].date), y:$scope.etf.data[i].sma_100});
  	$scope.data_chart.sma_300.push({x:Date.parse($scope.etf.data[i].date), y:$scope.etf.data[i].sma_300});

  	}

  	
  	$scope.header = "Ticker " + $scope.etf.ticker;


     $scope.chart_data = [
         {
             "key" : "Closing price",
             "bar": true,
             "values" : $scope.data_chart.price
         },
         {
             "key" : "SMA 30 days",
             "values" : $scope.data_chart.sma_30

         },
         {
             "key" : "SMA 100 days",
             "values" : $scope.data_chart.sma_100

         },
         {
             "key" : "SMA 300 days",
             "values" : $scope.data_chart.sma_300

         }
     ];

     console.log($scope.chart_data);

     $scope.chart_options = {
            chart: {
                type: 'lineWithFocusChart',
                height: 500,
                margin : {
                    top: 20,
                    right: 40,
                    bottom: 60,
                    left: 50
                },
                transitionDuration: 500,
     
                xAxis: {
                    axisLabel: 'Date',
                    tickFormat: function(d){
                      return d3.time.format('%b %Y')(new Date(d)); 
                    }
                },
                x2Axis: {
                    tickFormat: function(d){
                        return d3.time.format('%b %Y')(new Date(d)); 
                    }
                },
                yAxis: {
                    axisLabel: 'Price',
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    },
                    rotateYLabel: false
                },
                y2Axis: {
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    }
                }

            }
        };


  		})
  		.error(function(data, status, headers, config){
      	console.log("ERROR");
     

    	}); };

      $scope.get();
      $scope.title_section = "<small>Control panel</small>";
  	
    }]);