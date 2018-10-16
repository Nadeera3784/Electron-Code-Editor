function sendHttp(method, url, body, callback) {
	const sendHttpFunc = sendHttpRaw;
	return sendHttpFunc(method, url, body, callback);
}

function sendHttpRaw(method, url, body, callback) {
	var request = new XMLHttpRequest();

	if (callback) {
		request.onreadystatechange = function () {
			if (request.readyState == 4) callback(request);
		};
	}

	request.open(method, url, true);
	request.send(body);
}

function registerStandardHints() {
	function createHint(line, wordStart, wordEnd, cname) {
		var word = line.slice(wordStart, wordEnd);
		if (!cname) cname = 'hint-word';

		function renderer(elem, data, cur) {
			if (wordStart > 0) {
				elem.appendChild(document.createTextNode(line.slice(0, wordStart)));
			}
			var wordElem = document.createElement("span");
			wordElem.className = cname;
			wordElem.appendChild(document.createTextNode(word));
			elem.appendChild(wordElem);
			if (wordEnd < line.length) {
				var leftover = line.slice(wordEnd);
				if (line.length > 60 && leftover.length > 3) {
					leftover = leftover.slice(0, 57 - wordEnd) + '...';
				}
				elem.appendChild(document.createTextNode(leftover));
				elem.title = line;
			}
		}
		return {
			text: word,
			render: renderer,
			source: line
		};
	}

	// Add hint highlighting
	var hints = [
		createHint("program :: Program", 0, 7),
		createHint("--  single line comment", 0, 2, 'hint-keyword'),
		createHint("{-  start a multi-line comment", 0, 2, 'hint-keyword'),
		createHint("-}  end a multi-line comment", 0, 2, 'hint-keyword'),
		createHint("::  write a type annotation", 0, 2, 'hint-keyword'),
		createHint("->  declare a function type or case branch", 0, 2, 'hint-keyword'),
		createHint("<-  list comprehension index", 0, 2, 'hint-keyword'),
		createHint("..  list range", 0, 2, 'hint-keyword'),
		createHint("case  decide between many options", 0, 4, 'hint-keyword'),
		createHint("of  finish a case statement", 0, 2, 'hint-keyword'),
		createHint("if  decide between two choices", 0, 2, 'hint-keyword'),
		createHint("then  1st choice of an if statement", 0, 4, 'hint-keyword'),
		createHint("else  2nd choice of an if statement", 0, 4, 'hint-keyword'),
		createHint("data  define a new data type", 0, 4, 'hint-keyword'),
		createHint("let  define local variables", 0, 3, 'hint-keyword'),
		createHint("in  finish a let statement", 0, 2, 'hint-keyword'),
		createHint("where  define local variables", 0, 5, 'hint-keyword'),
		createHint("type  define a type synonym", 0, 4, 'hint-keyword'),
		createHint("(:) :: a -> [a] -> [a]", 1, 2)
	];

	CodeMirror.registerHelper('hint', 'codeworld', function (cm) {
		var cur = cm.getCursor();
		var token = cm.getTokenAt(cur);

		// If the current token is whitespace, it can be split.
		if (/^\s+$/.test(token.string)) {
			var term = "";
			var from = cur;
		} else {
			var term = token.string.substr(0, cur.ch - token.start);
			var from = CodeMirror.Pos(cur.line, token.start);
		}

		var found = [];

		for (var i = 0; i < hints.length; i++) {
			var hint = hints[i];
			if (hint.text.startsWith(term)) {
				found.push(hint);
			}
		}

		var lines = cm.getValue().split("\n");
		for (var i = 0; i < lines.length; i++) {
			if (/^\S*\s*::[^:]*$/.test(lines[i])) {
				var candidate = lines[i].split(" ::")[0];
				if (candidate.startsWith(term)) {
					found.push(createHint(lines[i], 0, candidate.length));
				}
			}
		}

		if (found.length > 0) return {
			list: found,
			from: from,
			to: cur
		};
	});

	sendHttp('GET', 'codeworld-base.txt', null, function (request) {
		var lines = [];
		if (request.status != 200) {
			console.log('Failed to load autocomplete word list.');
		} else {
			lines = request.responseText.split('\n');
		}

		var startLine = lines.indexOf('module Prelude') + 1;
		var endLine = startLine;
		while (endLine < lines.length) {
			if (lines[endLine].startsWith("module ")) {
				break;
			}
			endLine++;
		}
		lines = lines.slice(startLine, endLine);

		// Special case for "main" and "program", since they are morally
		// built-in names.
		/*codeworldKeywords['main'] = 'deprecated';
		codeworldKeywords['program'] = 'builtin';*/

		lines = lines.sort().filter(function (item, pos, array) {
			return !pos || item != array[pos - 1];
		});

		var hintBlacklist = [
			// Symbols that only exist to implement RebindableSyntax, map to
			// built-in Haskell types, or maintain backward compatibility.
			"Bool",
			"IO",
			"fail",
			"fromCWText",
			"fromDouble",
			"fromInt",
			"fromInteger",
			"fromRational",
			"fromString",
			"ifThenElse",
			"path",
			"thickPath",
			"toCWText",
			"toDouble",
			"toInt",
		];

		lines.forEach(function (line) {
			if (line.startsWith("type Program")) {
				// We must intervene to hide the IO type.
				line = "data Program";
			} else if (line.startsWith("type Truth")) {
				line = "data Truth";
			} else if (line.startsWith("True ::")) {
				line = "True :: Truth";
			} else if (line.startsWith("False ::")) {
				line = "False :: Truth";
			} else if (line.startsWith("newtype ")) {
				// Hide the distinction between newtype and data.
				line = "data " + line.substr(8);
			} else if (line.startsWith("pattern ")) {
				// Hide the distinction between patterns and constructors.
				line = line.substr(8);
			} else if (line.startsWith("class ")) {
				return;
			} else if (line.startsWith("instance ")) {
				return;
			} else if (line.startsWith("-- ")) {
				return;
			} else if (line.startsWith("infix ")) {
				return;
			} else if (line.startsWith("infixl ")) {
				return;
			} else if (line.startsWith("infixr ")) {
				return;
			}

			// Filter out strictness annotations.
			line = line.replace(/(\s)!([A-Za-z\(\[])/g, '$1$2');

			// Filter out CallStack constraints.
			line = line.replace(/:: HasCallStack =>/g, '::');

			var wordStart = 0;
			if (line.startsWith("type ") || line.startsWith("data ")) {
				wordStart += 5;

				// Hide kind annotations.
				var kindIndex = line.indexOf(" ::");
				if (kindIndex != -1) {
					line = line.substr(0, kindIndex);
				}
			}

			var wordEnd = line.indexOf(" ", wordStart);
			if (wordEnd == -1) {
				wordEnd = line.length;
			}
			if (wordStart == wordEnd) {
				return;
			}

			if (line[wordStart] == "(" && line[wordEnd - 1] == ")") {
				wordStart++;
				wordEnd--;
			}

			var word = line.substr(wordStart, wordEnd - wordStart);

			if (hintBlacklist.indexOf(word) >= 0) {
				///codmirrorKeywords[word] = 'deprecated';
			} else if (/^[A-Z:]/.test(word)) {
				//codmirrorKeywords[word] = 'builtin-2';
				hints.push(createHint(line, wordStart, wordEnd));
			} else {
				//codmirrorKeywords[word] = 'builtin';
				hints.push(createHint(line, wordStart, wordEnd));
			}

		});

		hints.sort(function (a, b) {
			return a.source < b.source ? -1 : 1
		});
		CodeMirror.registerHelper('hint', 'codeworld', hints);
	});
}
