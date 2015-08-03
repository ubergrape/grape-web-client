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
    this.Selection = scribe.api.Selection
  }

  /**
   * Place markers and remove all markers except of the first one.
   */
  placeMarker() {
    this.scribe.el.focus()
    let selection = new this.Selection()
    selection.placeMarkers()
    let markers = toArray(selection.getMarkers())
    markers.shift()
    markers.forEach(utils.remove)
    return selection
  }

  /**
   * Get parent node of the caret.
   */
  getParent(sel) {
    let selection = sel
    if (!selection) {
      this.scribe.el.focus()
      selection = new this.Selection()
    }
    return selection.getContaining(utils.isElement)
  }

  /**
   * Get text before/after the caret position.
   */
  getText(side) {
    let selection = this.placeMarker()
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
    this.scribe.el.focus()
    if (side) utils.insert(side, MARKER_EL, node)
    let selection = new this.Selection()
    selection.selectMarkers()
  }
}

