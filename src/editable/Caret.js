import toArray from 'lodash/lang/toArray'
import query from 'component-query'

import * as utils from './utils'

const GRAPE_MARKER_CLASS = 'grape-browser-marker'

// TODO use it from scribe.
const MARKER_CLASS = 'scribe-marker'
const MARKER_EL = document.createElement('em')
MARKER_EL.className = MARKER_CLASS

/**
 * Helper class for caret manipulation.
 */
export default class Caret {
  static MARKER_HTML = `<em class="${MARKER_CLASS}" style="display: none;"></em>`

  static renameMarkers = (markers = [], dir = 'scribe') => {
    markers.forEach(marker => {
      marker.className = dir === 'scribe' ? MARKER_CLASS : GRAPE_MARKER_CLASS
    })
  }

  constructor(scribe) {
    this.scribe = scribe
  }

  /**
   * Focus element if not already focused.
   * Returns true if did focus set.
   */
  focus() {
    let {el} = this.scribe
    if (el !== document.activeElement) {
      el.focus()
      return true
    }
    return false
  }

  /**
   * Create an instance of Selection.
   */
  createSelection(focus) {
    if (focus) this.focus()
    return new this.scribe.api.Selection()
  }

  /**
   * Place markers and remove all markers except of the first one.
   */
  placeMarker(selection = this.createSelection(true)) {
    selection.placeMarkers()
    let markers = this.getMarkers({selection})
    markers.shift()
    markers.forEach(utils.remove)
  }

  /**
   * Returns scribe markers by default.
   * If grape is true, returns also grape markers.
   */
  getMarkers({grape = false, scribe = true, selection} = {}) {
    let markers = []

    if (scribe) {
      let sel = selection || this.createSelection(true)
      let scribeMarkers = toArray(sel.getMarkers())
      markers = markers.concat(scribeMarkers)
    }

    if (grape) {
      let grapeMarkers = toArray(query.all('.' + GRAPE_MARKER_CLASS, this.scribe.el))
      markers = markers.concat(grapeMarkers)
    }

    return markers
  }

  /**
   * Get parent node of the caret.
   */
  getParent(selection = this.createSelection(true)) {
    return selection.getContaining(utils.isElement)
  }

  /**
   * Get text before/after the caret position.
   */
  getText(side, selection = this.createSelection(true)) {
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
    let selection = this.createSelection(true)
    if (side) utils.insert(side, MARKER_EL, node)
    selection.selectMarkers()
  }
}

