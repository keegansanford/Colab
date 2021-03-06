'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Project = mongoose.model('Project'),
	_ = require('lodash');

/**
 * Create a project
 */
exports.create = function(req, res) {
	var project = new Project(req.body);
	project.user = req.user;

	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
			socketio.sockets.emit('project.created', project); // emit an event for all connected clients
			res.json(project);
		}
	});
};

/**
 * Show the current project
 */
exports.read = function(req, res) {
	res.json(req.project);
};

/**
 * Update a project
 */
exports.update = function(req, res) {
	var project = req.project;

	project = _.extend(project, req.body);

	project.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(project);
		}
	});
};

/**
 * Delete an project
 */
exports.delete = function(req, res) {
	var project = req.project;

	project.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(project);
		}
	});
};

/**
 * List of Projects
 */
exports.list = function(req, res) {
	Project.find().sort('-created').populate('user', 'displayName').exec(function(err, projects) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(projects);
		}
	});
};

exports.listUserProjects = function(req, res){
	Project.find({ user: req.user }).sort('-created').populate('user', 'displayName').exec(function(err, projects) {
		if (err) {
	  		return res.status(400).send({
	    	message: errorHandler.getErrorMessage(err)
	  	});
		} else {
	  		res.jsonp(projects);
		}
	});
};

exports.listRelevantProjects = function(req, res){
	var userTags = [];
	var userSocial = req.user.social;

	if(userSocial.behance || userSocial.dribbble){
		userTags.push('Photoshop', 'Illustrator', 'Sketch', 'Design');
		console.log(userTags);
	}
	if(userSocial.github || userSocial.codepen){
		userTags.push('Code', 'Javascript');
		console.log(userTags);
	}

	Project.find({ tags: { $in: userTags } }).sort('-created').populate('user', 'displayName').exec(function(err, projects){
		if(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else{
			res.jsonp(projects);
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

	Project.findById(id).populate('user', 'displayName').exec(function(err, project) {
		if (err) return next(err);
		if (!project) {
			return res.status(404).send({
				message: 'Project not found'
			});
		}
		req.project = project;
		next();
	});
};

/**
 * Project authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.project.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
