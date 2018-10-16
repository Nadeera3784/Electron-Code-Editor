(function() {
	'use strict';
	var express = require('express');
	var logger = require('morgan');
	var bodyParser = require('body-parser');

	var routes = require('./lib/FileServer.js');

	var app = express();

	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use('/', routes);

	app.set('port', process.env.PORT || 3000);

	var server = app.listen(app.get('port'), function() {
		console.log('Express server listening on port ' + server.address().port);
	});

	module.exports = app;
}());
