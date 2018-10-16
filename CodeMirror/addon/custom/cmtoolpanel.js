
//import './cmtoolpanel.css'
(function (mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
      mod(require("codemirror"))
  else if (typeof define == "function" && define.amd) // AMD
      define(["codemirror"], mod)
  else // Plain browser env
      mod(CodeMirror)
})((CodeMirror) => {
  let createPanel = (cm, temp, position) => {
    let el = document.createElement('div')
    el.className = 'cm-toolpanel-dialog'

    if (typeof temp == 'string') {
        el.innerHTML = temp
    } else {
        el.appendChild(temp)
    }
    let panel = cm.addPanel(el, {
        position: position ? position.bottom ? 'bottom' : 'top' : 'top'
    })
    return panel
  }

  let closePanel = (cm) => {
      let state = cm.state.advancedDialog
      if (!state || !state.current) {
          return
      }

      state.current.panel.clear()

      if (state.current.onClose) state.current.onClose(state.current.panel.node)
      delete state.current
      cm.focus()
  }

  CodeMirror.defineExtension('openToolpanelDialog', function (temp, options) {
      if (!this.addPanel) throw `Panel.js addon.`
      if (!options) options = {}
      if (!this.state.advancedDialog) this.state.advancedDialog = {}

      if (this.state.advancedDialog.current) closePanel(this)

      let panel = createPanel(this, temp, options.bottom)
      this.state.advancedDialog.current = {
          panel: panel,
          onClose: options.onClose
      }

      return () => {
          closePanel(this)
      }
  })
})