"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

let sqlite3 = require('sqlite3');
const path = require('path');
//const app = require('electron');

let DBSqlite3 = (function () {
	function DBSqlite3() {
	}
	DBSqlite3.prototype.initialize = function (dbname) {
		const db_pth = path.join(__dirname, '..', 'database', dbname);
		const db = new sqlite3.Database(db_pth);
		db.run("CREATE TABLE IF NOT EXISTS `lastOpened` ( `id` INTEGER NOT NULL PRIMARY KEY, `directorypath` char ( 100 ) NOT NULL, NULL)");
		return db;
	};
	
	DBSqlite3.prototype.getDirectory = function (connection) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.serialize(function(){
				connection.all('SELECT directorypath  FROM `lastOpened` ORDER BY id', function(err, rows){
					if (err) reject(err);
					resolve(rows);
				});
			});
		});
	};

	DBSqlite3.prototype.addDirectory = function (connection, file) {
		return new Promise(function(resolve, reject) {
			if(!connection) reject();
			connection.serialize(function(){
				connection.run('INSERT INTO `lastOpened` (directorypath) VALUES (?)' ,[file.directorypath],  function(err, results){
					if (err) reject(err);
					resolve(results);
				});
			});
		});
	}; 

	
	DBSqlite3.prototype.close = function (connection) {
		connection.close();       
	};    
	return DBSqlite3;
}());
exports.Sqlite3Helpers = DBSqlite3;
