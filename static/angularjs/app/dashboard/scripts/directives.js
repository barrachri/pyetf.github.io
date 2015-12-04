angular.module('angularjsApp').
directive("breadCrumb",function(){
  return {
      restrict: "EA",
      scope: false,
      controller: function (){

      },
      template: '<div class="alert alert-{% if msg.status == True %}success{% endif %}{% if msg.status == False %}danger{% endif %}" role="alert"> \
    <button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> \
    {{msg.code}}</div>'
  }    
 });

angular.module('angularjsApp').directive('displayMessage', function() {
	return {
		restrict: 'E',
		scope: {
        	messageType: '=type',
        	message: '=data'
      	},
		template: '<div class="alert {{messageType}}">{{message}}</div>',
		link: function (scope, element, attributes) {
            scope.$watch(attributes, function (value) {
            	console.log(attributes);
            	console.log(value);
            	console.log(element[0]);
                element[0].children.hide(); 
            });
        }
	}
});
