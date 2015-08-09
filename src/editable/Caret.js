import toArray from 'lodash/lang/toArray'

import * as utils from './utils'

// TODO use it from scribe.
const MARKER_CLASS = 'scribe-marker'
const MARKER_EL = document.createElement('em')
MARKER_EL.className = MARKER_CLASS

/**
 * Helper class for caret manipulation.
 */
export default class Caret {
  static MARKER_HTML = `<em class="${MARKER_CLASS}" style="display: none;"></em>`

  constructor(scribe) {
    this.scribe = scribe
  }

  focus() {
    let {el} = this.scribe
    if (el !== document.activeElement) {
      el.focus()
      return true
    }
    return false
  }

  getSelection(focus) {
    if (focus) this.focus()
    return new this.scribe.api.Selection()
  }

  /**
   * Place markers and remove all markers except of the first one.
   */
  placeMarker(selection = this.getSelection(true)) {
    selection.placeMarkers()
    let markers = toArray(selection.getMarkers())
    markers.shift()
    markers.forEach(utils.remove)
  }

  /**
   * Get parent node of the caret.
   */
  getParent(selection = this.getSelection(true)) {
    return selection.getContaining(utils.isElement)
  }

  /**
   * Get text before/after the caret position.
   */
  getText(side, selection = this.getSelection(true)) {
    this.placeMarker(selection)
    let parent = this.getParent(selection).cloneNode(true)
    // Remove all elements except of marker.
    toArray(parent.childNodes).forEach(node => {
      if (utils.isElement(node) && node.className !== MARKER_CLASS) {
        utils.remove(node)
      }
    })
    let parts = parent.innerHTML.split(Caret.MARKER_HTML)
    return parts[side === 'before' ? 0 : 1]
  }

  /**
   * Move caret before/after the node or after already existing marker.
   */
  move(side, node) {
    let selection = this.getSelection(true)
    if (side) utils.insert(side, MARKER_EL, node)
    selection.selectMarkers()
  }
}

