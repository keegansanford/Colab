'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
	require('./users/users.authentication.server.controller'),
	require('./users/users.authorization.server.controller'),
	require('./users/users.password.server.controller'),
	require('./users/users.profile.server.controller')
);

//user skill tags
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Usertag = mongoose.model('Usertag'),
	_ = require('lodash');

/**
 * Create a project
 */
exports.create = function(req, res) {
	var usertag = new Usertag(req.body);

	usertag.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(usertag);
		}
	});
};

/**
 * Show the current project
 */
exports.read = function(req, res) {
	res.json(req.usertag);
};

/**
 * Update a project
 */
exports.update = function(req, res) {
	var usertag = req.usertag;

	usertag = _.extend(usertag, req.body);

	usertag.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(usertag);
		}
	});
};

/**
 * Delete an project
 */
exports.delete = function(req, res) {
	var usertag = req.usertag;

	usertag.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(usertag);
		}
	});
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
	Usertag.find().sort('-created').populate('user', 'displayName').exec(function(err, usertag) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(usertag);
		}
	});
};

exports.listUserProjects = function(req, res){
	Usertag.find({ user: req.user }).sort('-created').populate('user', 'displayName').exec(function(err, projects) {
		if (err) {
	  		return res.status(400).send({
	    	message: errorHandler.getErrorMessage(err)
	  	});
		} else {
	  		res.jsonp(Usertag);
		}
	});
};

/**
 * Project middleware
 */
exports.projectByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Project is invalid'
		});
	}

	Usertag.findById(id).populate('user', 'displayName').exec(function(err, usertag) {
		if (err) return next(err);
		if (!usertag) {
			return res.status(404).send({
				message: 'Project not found'
			});
		}
		req.usertag = usertag;
		next();
	});
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.usertag.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
