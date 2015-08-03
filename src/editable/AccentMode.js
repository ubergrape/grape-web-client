import bindAll from 'lodash/function/bindAll'

/**
 * Accent mode detector which can be triggered by ~`´^ and maybe
 * more characters.
 * If an Input Method Editor is processing key input and the event is keydown, return 229.
 * https://lists.w3.org/Archives/Public/www-dom/2010JulSep/att-0182/keyCode-spec.html
 */
export default class AccentMode {
  constructor(node) {
    this.active = false
    this.node = node
    bindAll(this, 'onClick', 'onKeyDown', 'onBlur')
    this.addListeners()
  }

  addListeners() {
    this.node.addEventListener('click', this.onClick)
    this.node.addEventListener('blur', this.onBlur)
    this.node.addEventListener('keydown', this.onKeyDown)
  }

  onClick() {
    this.active = false
  }

  onBlur() {
    this.active = false
  }

  onKeyDown(e) {
    this.active = e.keyCode === 229
  }
}
