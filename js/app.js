const {remote}                = require('electron');
const {dialog, clipboard, ipcMain, ipcRenderer}     = remote;
const electronTitlebarWindows = require('./js/titlebar.js');
const dirTree                 = require('directory-tree');
const RandomGenerator         = require('./js/random_generator.js');
const Terminal                = require('xterm').Terminal;
const fit                     = require('xterm/lib/addons/fit/fit');
const ligatures               = require('xterm-ligature-support');
const pty                     = require('node-pty');
const os                      = require('os');
const _debounce               = require('lodash.debounce');
const path                    = require('path');
const FileDB_01               = require('./lib/FileDB.js');

let titlebar = new electronTitlebarWindows({
	darkMode: false,
	color: '#5E5B89',
	backgroundColor: '#222246',
	draggable: true,
	fullscreen: false
});

titlebar.appendTo(document.querySelector('#titlebar'));

titlebar.on('close', function(){
	remote.getCurrentWindow().close();
});

titlebar.on('minimize', function(){
	remote.getCurrentWindow().minimize();
});

let Front_Handler = angular.module("myApp", ['ui.bootstrap.contextMenu', 'jsTree.directive']);

Front_Handler.controller('MainController', function($scope, $http, ContextMenuEvents, FetchFileFactory) {
	if(typeof CodeMirror !== 'undefined'){
		let EditorElement = document.getElementById("editor");
		let Editor = CodeMirror(EditorElement,{
			mode: {
				name: "javascript",
				json: true,
				globalVars: true
			},
			lineNumbers: true,
			theme: "lesser-dark",
			lineWrapping: true,
			indentUnit: 4,
			indentWithTabs: true,
			styleActiveLine: true,
			foldGutter: true,
			autoCloseBrackets: true,
			keyMap: "sublime",
			matchBrackets: true,
			showCursorWhenSelecting : true,
			showMatchesOnScrollbar : true,
			beautify: {beautify: false},
			blastCode: { effect: 1, shake : false},
			highlightSelectionMatches: {showToken: /\w/},
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "breakpoints"],
			extraKeys: {
				"Ctrl-D": function(cm){
					let sel = cm.getSelection();
					let hasSelection = (sel.start.line !== sel.end.line) || (sel.start.ch !== sel.end.ch);
					if (!hasSelection) {
						sel.start.ch = 0;
						sel.end = {line: sel.start.line + 1, ch: 0};
					}
					let selectedText = cm.getRange(sel.start, sel.end);
					cm.replaceRange(selectedText, sel.start);
				}
			}
		});
		
		Inlet(Editor);
		
		emmetCodeMirror(Editor);
		
		let charWidth = Editor.defaultCharWidth(), basePadding = 4;
		
		Editor.on("renderLine", function(cm, line, elt) {
			let off = CodeMirror.countColumn(line.text, null, cm.getOption("tabSize")) * charWidth;
			elt.style.textIndent = "-" + off + "px";
			elt.style.paddingLeft = (basePadding + off) + "px";
			document.getElementById("LangMode").innerHTML = CharFormat(cm.getMode().name) ;
		});
		
		Editor.refresh();
		
		Editor.on("gutterClick", function(cm, event) {
			let info = cm.lineInfo(event);
			cm.setGutterMarker(event, "breakpoints", info.gutterMarkers ? null : makeMarker());
		});
		
		function makeMarker() {
			let marker = document.createElement("div");
			marker.style.color = "#ff2f2f";
			marker.innerHTML = "<i class='mdi mdi-arrow-right-bold-circle-outline'></i>";
			return marker;
		}
		function CharFormat(input) {
			return (!!input) ? input.split(' ').map(function(wrd){return wrd.charAt(0).toUpperCase() + wrd.substr(1).toLowerCase();}).join(' ') : '';
		}
		
		Editor.on("inputRead", function (cm, event) {
			if (!cm.state.completionActive && event.keyCode != 13) {      
				CodeMirror.commands.autocomplete(cm, null, {completeSingle: true});
			}
			
/*			let current_line = cm.getCursor().line;
			var Widget;
			var node = document.createElement("div");
			node.className = "inline-widget animating snippet-form-widget";
			var topshadow = node.appendChild(document.createElement("div"));
			topshadow.className = "shadow top";
			var bottomshadow = node.appendChild(document.createElement("div"));
			bottomshadow.className = "shadow bottom";
			var close = bottomshadow.appendChild(document.createElement("a"));
			close.className = "close no-focus";
			close.setAttribute("href", "#");
			close.textContent = "X";
			CodeMirror.on(close, "click", function() {
				Widget.clear();;
			});
			var content = node.appendChild(document.createElement("h1"));
			content.textContent = "foo bar test";

			var options = {
				coverGutter : true
			}
			Widget = cm.addLineWidget(current_line,node , options);*/
		});
		
		Editor.on("change", function(cm, event){
			let lines = cm.lineCount();
			if(lines > 0){
				document.getElementById("status-file").innerHTML = lines + " " + "Lines";
			}else{
				document.getElementById("status-file").innerHTML = 1 + " " + "Line";
			}
		});
		
		Editor.on("cursorActivity", function(cm, event){
			let current_line = cm.getCursor().line;
			if(current_line > 0){
				document.getElementById("status-cursor").innerHTML =  "Line" + " " + current_line + " /" ;
			}else{
				document.getElementById("status-cursor").innerHTML =  "Line" + " " + 1 + " /";
			}
		});	
		
		Editor.on('keydown', function(cm, event) {
			let command     = "",
				text        = "",
				start       = 0,
				end         = 0,
				codemirror  = null,
				i           = 0;
			
			if((event.code === "Tab") && (event.keyCode === 9)){				
				command = _getLoremCommand(cm);
				if (command) {
					text    = RandomGenerator.parseCommand(command);
					end     = cm.getCursor();
					start   = {line: end.line, ch: end.ch - command.length};
					cm.replaceRange(text, start, end);
					codemirror = cm;
					if (codemirror) {
						end = cm.getCursor();
						for (i = (start.line); i <= end.line; i++) {
							codemirror.indentLine(i);
						}
					}

					event.preventDefault();
				}
			}
		});
		
		function _getLoremCommand(editor) {
			let document    = editor,
				pos         = editor.getCursor(),
				line        = editor.getLine(pos.line),
				start       = pos.ch,
				end         = pos.ch,
				command     = "";

			while (start > 0 && (/\S/).test(line.charAt(start - 1))) {
				--start;
			}

			command = editor.getRange({line: pos.line, ch: start}, {line: pos.line, ch: end});

			if (command.match(/dummytext/)) {
				command = command.substring(command.match(/dummytext/).index);
			}

			return ((command.split("_")[0] === "dummytext") ? command : "");
		}
		
		
		/*Find Comments */

		let doneRegExp = /^\[x\]/i;
		let todos = [];
		let tags = ['TODO', 'NOTE', 'FIXME', 'CHANGES', 'FUTURE'];
		let colors = {
			default: 'btn-native',
			fixme: 'btn-danger',
			future:'btn-info',
			note: 'btn-success',
			todo: 'btn-warning',
			changes : 'btn-native'
		};
		let settings = {
			regex: {
				prefix: '(?:<!--|\\/\\*|\\/\\/|#|--) *@?(',
				suffix: '):? *(.*?) ?(?=\\/\\*|-->|\\*\\/|\\r\\n|\\n|\\r|$)'
			}
		};

		let expression = new RegExp(
			settings.regex.prefix + tags.map(function (tag) { return tag; }).join('|') + settings.regex.suffix,
			'g' + (settings.case !== false ? '' : 'i')
		);

		function clean (tag) {
			return tag.split(':', 1)[0].replace(/[^a-zA-Z]/g, '').toLowerCase();
		}
		//cm.getValue()
		function parse (text, expression){
			let matches;
			while ((matches = expression.exec(text)) !== null) {
				let todo = {
					tag: clean(matches[1]),
					comment: matches[2],
					line: text.substr(0, matches.index).split('\n').length,
					char: matches.index - text.lastIndexOf('\n', matches.index),
				};
				todo.key = todo.line + ':' + todo.char;
				todo.color = colors[todo.tag];
				todo.done = doneRegExp.test(todo.comment);
				todo.comment = todo.comment.replace(doneRegExp, '');
				todos.push(todo);
			}
			return todos;
		}
        
		function countTags(todos){
			let count = [];
			todos.forEach(function (todo) {
				count[todo.tag] = count[todo.tag] === undefined ? 1 : count[todo.tag] + 1;
			});
			return count;
		}

		
		/*End Find Comments*/	
		var TaskPanel;
		let OpenTaskPanel = document.getElementById("task");
		OpenTaskPanel.addEventListener("click",  function(e){
			e.preventDefault;
			addTaskPanel(Editor, "bottom");
			//console.log(countTags(todos));
			//console.log(Editor.getLine(2));
		});
		function addTaskPanel(editor, where) {
			//var node = makePanel(where);
			let node = document.createElement("div");
			let close,  pbody, toolbar, title , settings, btn, tbcontainer, table, tbody, tr, td_01, td_02, filter;
			node.className = "panel " + where;
			toolbar = node.appendChild(document.createElement("div"));
			toolbar.setAttribute("class", "toolbar");
			title = toolbar.appendChild(document.createElement("span"));
			title.setAttribute("class", "title");
			title.textContent = "Task List";
			let todo_count_array = countTags(todos);
			for (x in todo_count_array) {
				filter = toolbar.appendChild(document.createElement("button"));
				filter.className = 'btn btn-xs btn-native';
				filter.textContent = todo_count_array[x];
			}
			settings = toolbar.appendChild(document.createElement("span"));
			settings.setAttribute("class", "pull-right");
			close = settings.appendChild(document.createElement("button"));
			close.setAttribute("class", "remove-panel btn btn-xs btn-close");
			close.innerHTML = "<i class='mdi mdi-close'></i>";
			close.addEventListener("click" , function(){
				TaskPanel.clear();
			});
			pbody = node.appendChild(document.createElement("div"));
			pbody.setAttribute("class", "panel-body todo-panel");
			tbcontainer = pbody.appendChild(document.createElement("div"));
			tbcontainer.setAttribute("class", "table-container");
			table = tbcontainer.appendChild(document.createElement("table"));
			table.setAttribute("class", "table todo");
			tbody = table.appendChild(document.createElement("tbody"));
			let chunk = parse(Editor.getValue(), expression);
			chunk.forEach(function (filtered) {
				tr   = tbody.appendChild(document.createElement("tr"));
				td_01   = tr.appendChild(document.createElement("td"));
				td_01.textContent = filtered.line;
				td_02   = tr.appendChild(document.createElement("td"));
				btn = td_02.appendChild(document.createElement('button'));
				btn.setAttribute("class", "btn btn-xs" + " " + filtered.color);
				btn.setAttribute("type", 'button');
				btn.textContent = filtered.tag.toUpperCase();
				CodeMirror.on(btn, "click", function() {
					Editor.setCursor(filtered.line);
				});
			});
			TaskPanel = editor.addPanel(node, {position: where, stable: true});
/*			CodeMirror.on(close, "click", function() {
				TaskPanel.clear();
			});*/
		}
		/*Test start*/
/* 		let ConsolePanel;
		let OpenConsolePanel = document.getElementById("console");
		OpenConsolePanel.addEventListener("click",  function(e){
			e.preventDefault;
			addConsolePanel(Editor, "bottom");
		});
		
		function addConsolePanel(editor, where) {
			let node = window.document.createElement("div");
			let close,  pbody, toolbar, title , settings, btn, tbcontainer,  d;
			node.className = "panel " + where;
			toolbar = node.appendChild(window.document.createElement("div"));
			toolbar.setAttribute("class", "toolbar");
			title = toolbar.appendChild(window.document.createElement("span"));
			title.setAttribute("class", "title");
			title.textContent = "Console";
			settings = toolbar.appendChild(window.document.createElement("span"));
			settings.setAttribute("class", "pull-right");
			close = settings.appendChild(window.document.createElement("button"));
			close.setAttribute("class", "remove-panel btn btn-xs btn-close");
			close.innerHTML = "<i class='mdi mdi-close'></i>";
			close.addEventListener("click" , function(){
				ConsolePanel.clear();
			});
			pbody = node.appendChild(window.document.createElement("div"));
			pbody.setAttribute("class", "panel-body todo-panel");
			tbcontainer = pbody.appendChild(window.document.createElement("div"));
			tbcontainer.setAttribute("class", "console-container");
			d = tbcontainer.appendChild(window.document.createElement("div")); */
/*
			Terminal.applyAddon(fit);
			Terminal.applyAddon(ligatures);
			
			const xterm = new Terminal({
				fontFamily: 'Fira Code, Iosevka, monospace',
				fontSize: 12,
				experimentalCharAtlas: 'dynamic',
				padding: 10,
				cursorBlink: true,
				scrollBar: true,
				theme: {
					background: '#2d2b55',
					foreground : "#55a8fd"
				}
			});
			
			const terminalElem = document.getElementById("EditorConsole");
			xterm.open(d);
			xterm.fit();  

			
			const ptyProc = pty.spawn(os.platform() === 'win32' ? 'cmd.exe' : process.env.SHELL || '/bin/bash', [], {
				name: 'xterm-color',
				cols: xterm.cols,
				rows: xterm.rows,
				cwd: process.env.PWD,
				env: process.env
			});

			const fitDebounced = _debounce(() => {
				xterm.fit(); 
			}, 17);
			
			
			xterm.on('data', function(data){
				ptyProc.write(data);
			});
			
			xterm.on('resize', function(size){
				ptyProc.resize(
					Math.max(size ? size.cols : xterm.cols, 1),
					Math.min(size ? size.rows : xterm.rows, 1)
				);
			});

			ptyProc.on('data', function(data){
				xterm.write(data);
			});
			
			window.onresize = () => {
				fitDebounced();
			};*/
			//ConsolePanel = editor.addPanel(node, {position: where, stable: true});
		//}
		
		function duplicateText(editor) {
			editor = editor;
			if (!editor) {
				return;
			}

			var sel = editor.getSelection();

			var hasSelection = (sel.start.line !== sel.end.line) || (sel.start.ch !== sel.end.ch);

			if (!hasSelection) {
				sel.start.ch = 0;
				sel.end = {line: sel.start.line + 1, ch: 0};
			}

			var cm = editor;

			var selectedText = cm.getRange(sel.start, sel.end);
			cm.replaceRange(selectedText, sel.start);
		}
		
		$scope.ContextMenu = [
			['Cut', function($itemScope, event, modelValue, text, $li) {
				clipboard.writeText(Editor.getSelection(), 'copy');
				Editor.replaceSelection('');
			}],
			['Copy', function($itemScope, event, modelValue, text, $li) {
				clipboard.writeText(Editor.getSelection(), 'copy');
			}],
			['Paste', function($itemScope, event, modelValue, text, $li) {
				Editor.replaceSelection(clipboard.readText('copy'));
			}],
			['SelectAll', function($itemScope, event, modelValue, text, $li) {
				Editor.execCommand('selectAll');
			}],
			['Beautify', function($itemScope, event, modelValue, text, $li) {
				Editor.beautify();
			}]
		];
		
		$scope.tree_core = {

			multiple: false,  

			check_callback: function (operation, node, node_parent, node_position, more) {
				if (operation === 'move_node') {
					return false;   
				}
				return true;  
			}
		};


		$scope.nodeSelected = function(e, data) {
			var _l = data.node.li_attr;
			if (_l.isLeaf) {
				//TODO  /[\w-]+\.js/
				var title = /[\w-]+\.js/.exec(_l.id.toString());
				FetchFileFactory.fetchFile(_l.base).then(function(data) {
					var _d = data.data;
					if (typeof _d == 'object') {

						_d = JSON.stringify(_d, undefined, 2);
					}
					Editor.setValue(_d);
					document.getElementById('tab1').innerHTML = title;
				});
			} else {
//				$scope.$apply(function() {
//					console.log('Please select a file to view its contents');
//				});
				return false;
			}
		};

		$scope.TreeContextMenu = {
			"Menu 1": {
				"label": "Delete",
				"action": function(obj) {
					console.log(obj.reference["0"].outerText);
				}
			},
			"Menu 2": {
				"label": "Rename",
				"action": function(obj) {
					console.log(obj);
				}
			},
			"Menu 3": {
				"label": "New File",
				"action": function(obj) {
					console.log(obj);
				}
			}
		};
		
		$scope.typesConfig = {
			"default": {
				"icon": "mdi mdi-file-outline"
			},
			"js": {
				"icon": "mdi mdi-language-javascript"
			}
		}
		
		let openButton = document.getElementById("project-dropdown-toggle");
		function handleOpenButton() {
			remote.dialog.showOpenDialog({
				properties: ['openDirectory']
			}, names => {
				new FileDB_01.FileDB().IsEqual(names[0]).then(function (result){
					console.log(result);
				});
			});
		}
		openButton.addEventListener("click", handleOpenButton);
		
		let Opentest = document.getElementById("console");
		Opentest.addEventListener("click",  function(event){
			let template = '<div id="EditorConsole"></div><div class="buttons"><button class="btn btn-warning btn-sm">Close</button>';
			Editor.openAdvancedDialog(template, 'top');
			event.preventDefault;
			
			Terminal.applyAddon(fit);
			Terminal.applyAddon(ligatures);

			const xterm = new Terminal({
				fontFamily: 'Fira Code, Iosevka, monospace',
				fontSize: 12,
				experimentalCharAtlas: 'dynamic',
				padding: 10,
				cursorBlink: true,
				scrollBar: true,
				theme: {
					background: '#2d2b55',
					foreground : "#55a8fd"
				}
			});

			const terminalElem = document.getElementById("EditorConsole");
			xterm.open(terminalElem);
			xterm.fit();  


			const ptyProc = pty.spawn(os.platform() === 'win32' ? 'cmd.exe' : process.env.SHELL || '/bin/bash', [], {
				name: 'xterm-color',
				cols: xterm.cols,
				rows: xterm.rows,
				cwd: process.env.PWD,
				env: process.env
			});

			const fitDebounced = _debounce(() => {
				xterm.fit(); 
			}, 17);


			xterm.on('data', function(data){
				ptyProc.write(data);
			});

			xterm.on('resize', function(size){
				ptyProc.resize(
					Math.max(size ? size.cols : xterm.cols, 1),
					Math.min(size ? size.rows : xterm.rows, 1)
				);
			});

			ptyProc.on('data', function(data){
				xterm.write(data);
			});

			window.onresize = () => {
				fitDebounced();
			};
		});

		
	}
	
});

Front_Handler.directive('switch', function(){
	return {
		restrict: 'AE'
		, replace: true
		, transclude: true
		, template: function(element, attrs) {
			var html = '';
			html += '<span';
			html +=   ' class="switch' + (attrs.class ? ' ' + attrs.class : '') + '"';
			html +=   attrs.ngModel ? ' ng-click="' + attrs.disabled + ' ? ' + attrs.ngModel + ' : ' + attrs.ngModel + '=!' + attrs.ngModel + (attrs.ngChange ? '; ' + attrs.ngChange + '()"' : '"') : '';
			html +=   ' ng-class="{ checked:' + attrs.ngModel + ', disabled:' + attrs.disabled + ' }"';
			html +=   '>';
			html +=   '<small></small>';
			html +=   '<input type="checkbox"';
			html +=     attrs.id ? ' id="' + attrs.id + '"' : '';
			html +=     attrs.name ? ' name="' + attrs.name + '"' : '';
			html +=     attrs.ngModel ? ' ng-model="' + attrs.ngModel + '"' : '';
			html +=     ' style="display:none" />';
			html +=     '<span class="switch-text">'; /*adding new container for switch text*/
			html +=     attrs.on ? '<span class="on">'+attrs.on+'</span>' : ''; /*switch text on value set by user in directive html markup*/
			html +=     attrs.off ? '<span class="off">'+attrs.off + '</span>' : ' ';  /*switch text off value set by user in directive html markup*/
			html += '</span>';
			return html;
		}
	}
});

Front_Handler.factory('FetchFileFactory', ['$http', function($http){
	var _factory = {};
	_factory.fetchFile = function(file) {
		return $http.get('http://localhost:3000/api/resource?resource=' + encodeURIComponent(file));
	};
	return _factory;
}]);

$(document).ready(function() {	
	
/*	$(".table-container").niceScroll({
		cursorwidth: '5px',
		cursorcolor: "#5E5B89",
		cursorborder: "1px solid #5E5B89",
		autohidemode: false,
		zindex: 999
	});*/
});
$(document).ready(function() {
	/*var term = new Terminal();
	term.open(document.getElementById('console'));
	term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')*/
	$("#settings").click(function(){
		$("#right-sidebar").toggleClass("open");
	});
	$(".settings-close,#settings-close-button").click(function(){
		$("#right-sidebar").removeClass("open");
	});
	
	$("#responsive-view").click(function(){
		$("#responsive-view-sidebar").toggleClass("open");
	});
});
