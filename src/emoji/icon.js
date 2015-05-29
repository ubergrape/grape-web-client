import escape from 'lodash-es/string/escape'
import each from 'lodash-es/collection/each'
import defaults from 'lodash-es/object/defaults'
import camelize from 'camelize'
import jss from 'jss'

import iconStyle from './iconStyle'

let sheet = jss.createStyleSheet(iconStyle).attach()

/**
 * Get a styled element for the icon.
 */
export function tpl(name, style = {}, attr = {}, options = {}) {
  if (options.jsx) {
    let baseAttr = {
      className: sheet.classes.icon,
      style: camelize(style),
      title: name
    }
    defaults(attr, baseAttr)
    return <i {...attr}> </i>
  }

  let baseAttr = {
    'class': sheet.classes.icon,
    style: toStyleStr(style),
    title: name
  }

  let attrStr = toAttrStr(attr)
  // Space inside is required for webkit browsers. Otherwise icon won't get
  // removed by backspace within contenteditable. Precondition is some text before.
  return `<i ${attrStr}> </i>`
}

/**
 * Convert style declarations to style string for inline insertion.
 */
function toStyleStr(decl) {
  let style = ''
  each(decl, (value, key) => {
    style += `${key}: ${value}; `
  })
  return style
}

/**
 * Convert attributes object to a string for html insertion. (naive version)
 */
function toAttrStr(attr) {
  let str = ''
  each(attr, (value, key) => {
    str += `${escape(key)}="${escape(value)}" `
  })
  return str
}
