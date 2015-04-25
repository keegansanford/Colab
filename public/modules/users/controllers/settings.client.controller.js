'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication, Usertag) {
		$scope.user = Authentication.user;

		$scope.tags = [
            { 'name': 'Photoshop', 'flag': '/modules/users/img/photoshop.png' },
    		{ 'name': 'Html5', 'flag': '/modules/users/img/html.png' }
          ];
		$scope.loadTags = function(query) {
			return $http.get('/tags?query=' + query);
		};

		$scope.create = function() {
			// Create new Project object
			console.log('create function called');
			var usertag = new Usertag({
				tags: []
			});

			//To store names as a string.  For Json file will have to change to an object
			for(var i=0; i<$scope.tags.length; i++) {
				usertag.tags.push($scope.tags[i].name);
			}
			console.log(usertag);
			// Redirect after save
			usertag.$save(function(response) {
				$location.path('profile');

				// Clear form fields
				$scope.tags = [];
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Get user's projects
		$scope.getUserProjects = function() {
			$http.get('/users/me/projects')
				.success(function(data){
					console.log(data);
					$scope.projects = data;
				});
		};
	}
]);