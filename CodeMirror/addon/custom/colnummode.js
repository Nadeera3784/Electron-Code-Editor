(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["codemirror"], mod);
  else // Plain browser env
    mod(CodeMirror);
})(function(
   /**
    * Defines option columnNumberMode, which provides hooks to allow
    * **external** UI to show column number.
    * The option value is in the form of {enabled: [true|false], callback:[function]} .
    * The callback function has a signature of ([boolean]enabled, [CodeMirror.Pos]pos)
    *
    * Also defines a convenient command toggleColumnNumberMode to turn on/off
    *
    * @exports CodeMirror
    **/
   CodeMirror) {
  "use strict";

  function doShowColumnNumber(cm) {
    cm.state._columnNumberModeCallback(true, cm.getCursor());
  } // function doShowColumnNumber()

  function showColumnNumber(cm) {
    cm.on('cursorActivity', doShowColumnNumber);
    doShowColumnNumber(cm);
  } // function showColumnNumber(..)

  function hideColumnNumber(cm) {
    function doHideColumnNumber(cm) {
      cm.state._columnNumberModeCallback(false, null);
    } // function doHideColumnNumber(..)

    cm.off('cursorActivity', doShowColumnNumber);
    doHideColumnNumber(cm);
  } // function hideColumnNumber(..)

  CodeMirror.defineOption("columnNumberMode", false, function(cm, val, prev) {
    if (prev == CodeMirror.Init) prev = { enabled: false };

    if (!val) val = { enabled: false };

    if (val.enabled && "function" !== typeof val.callback) {
      throw new TypeError('option columnNumberMode: if enabled set to true, callback must be set to a function to handle the display');
    }

    if (prev.enabled && !val.enabled) { // disabling, i.e., from true to false
      hideColumnNumber(cm);
    } else if (!prev.enabled && val.enabled) { // enabling, i.e., from false to true
      cm.state._columnNumberModeCallback = val.callback;
      showColumnNumber(cm);
    } // else option not changed, no action

  }); // defineOption("columnNumberMode")

  function toggleColumnNumberMode(cm) {
    // Note: the logic currently assumes that prior to the first execution,
    //  columnNumberMode has been enabled programmtically,
    //  with a callback in current option value (that the command can store a handle)
    var opt = cm.getOption("columnNumberMode");
    if (opt && opt.enabled) { // currently enabled: disable it
      cm.setOption("columnNumberMode", {enabled: false});
    } else { // currently disabled, enable it.
      cm.setOption("columnNumberMode", {enabled: true, callback: cm.state._columnNumberModeCallback});
    }
  } // function toggleColumnNumberMode(..)

  CodeMirror.commands.toggleColumnNumberMode = toggleColumnNumberMode;

});

