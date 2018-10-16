Object.defineProperty(exports, "__esModule", { value: true });

const path = require('path');
const Datastore = require('nedb');
const db = new Datastore({filename: path.join(__dirname, '../data/filesys.db'), autoload: true});

let FileDB = (function () {
	function FileDB() {
	}

	FileDB.prototype.GetOne = function () {
		return new Promise(function(resolve, reject) {
			db.find({}).limit(1).exec(function (err, docs) {
				if (err) reject(err);
				resolve(docs);
			});
		});
	};
	
	FileDB.prototype.IsEqual = function (value) {
		return new Promise(function(resolve, reject) {
			db.find({ DirectoryPath : value }, function (err, docs) {
				if (err) reject(err);
				if(docs.length > 0){
					return false;
				}else{
					
					db.find({}).limit(1).exec(function (err, docs) {
						if (err) reject(err);
						if(docs.length > 0){
							var checkValue = docs[0]['DirectoryPath'];
							console.log(checkValue);
							db.update({ DirectoryPath: checkValue}, { DirectoryPath: value}, {}, function (err, numReplaced) {
								if (err) reject(err);
								resolve(numReplaced);
							});
						}else{
							db.insert({DirectoryPath: value, openDate: new Date()}, function (err, newDoc) {
								if (err) reject(err);
								resolve(newDoc);
							});
						}
					});
				}
			});
		});
	};
	
	return FileDB;
}());
exports.FileDB = FileDB;
