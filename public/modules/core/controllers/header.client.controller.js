'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$rootScope', 'Authentication', 'Socket', 'Menus', 'Projects',
	function($scope, $rootScope, Authentication, Socket, Menus, Projects) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		Socket.on('project.created', function(project) {
			console.log(project);
                  $rootScope.myValue=true;
		});

		// Find a list of Projects
		$scope.find = function() {
			$scope.projects = Projects.query();
		};
	}
]);