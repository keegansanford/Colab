'use strict';

angular.module('users').controller('MatchesController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.authentication = Authentication;

		
	    //console.log("User "+ JSON.stringify($scope.authentication));
	    
		// Find a list of Users
	  	$scope.find = function() {
	    	$scope.users = Users.query();
	  	};

		
	}
]);