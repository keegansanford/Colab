'use strict';

// Configuring the Projects module
angular.module('projects').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Projects', 'projects', 'dropdown', '/projects(/create)?');
		Menus.addSubMenuItem('topbar', 'projects', 'All Projects', 'projects');
		Menus.addSubMenuItem('topbar', 'projects', 'New Projects', 'projects/create');
		Menus.addSubMenuItem('topbar', 'projects', 'Project Matches', 'projects/relevant');
	}
]);