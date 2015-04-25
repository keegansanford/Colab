'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Project Schema
 */
var UsertagSchema = new Schema({
	tags: [{
	  type: String
	}]
});

mongoose.model('Usertag', UsertagSchema);
