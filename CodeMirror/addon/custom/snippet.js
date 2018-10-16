(function (mod) {
	if (typeof exports == "object" && typeof module == "object")
		mod(require("codemirror"));
	else if (typeof define == "function" && define.amd)
		define(["codemirror"], mod);
	else
		mod(CodeMirror);
})(function (CodeMirror) {
	'use strict';

	let snippets = {};
	snippets.function = 'function(e,f){\n\n' + '}\n';
	snippets.if = 'if(){\n\n' + '}else{\n\n' + '}\n';
	snippets.dump = 'dummy text';
	function parseLine(line, cursorPosition) {
		let words;
		line = line.substring(0, cursorPosition);
		words = line.split(/\W/);
		return words[words.length - 1];
	}

	CodeMirror.defineOption("snippet", false, function (cm, val, old) {

		cm.on("inputRead", function (cm, change) {
			let cursorPosition;
			let line;
			let snippetKey;
			let start;
			cursorPosition = cm.getCursor();
			line = cm.getLine(cursorPosition.line);
			snippetKey = parseLine(line, cursorPosition.ch);
			if (snippets[snippetKey]) {
				start = {
					line: cursorPosition.line,
					ch: cursorPosition.ch - snippetKey.length
				};
				cm.replaceRange(snippets[snippetKey], start, cursorPosition);
				//e.preventDefault();
			}

		});
	});
});
