import injectSheet, {jss, ThemeProvider} from 'react-jss'
import {create} from 'jss'
import isolate from 'jss-isolate'
import extend from 'jss-extend'
import defaultUnit from 'jss-default-unit'
import vendorPrefixer from 'jss-vendor-prefixer'
import propsSort from 'jss-props-sort'
import expand from 'jss-expand'
import createStyled from 'styled-jss/createStyled'

import {typographyConstants, palette} from '../mui-theme'

const jssInline = create({
  plugins: [
    extend(),
    defaultUnit(),
    expand(),
    vendorPrefixer(),
    propsSort()
  ]
})

export const inlineStyle = style => jssInline.createRule(style).toJSON()

// Used by material-ui
jss.setup({
  ...jss.options,
  insertionPoint: 'grape-jss'
})
.use(isolate({
  isolate: false,
  reset: {
    fontFamily: typographyConstants.fontFamily,
    fontSize: typographyConstants.fontSize,
    boxSizing: 'border-box',
    textRendering: 'optimizeLegibility',
    color: palette.text.primary,
    listStyle: 'none'
  }
}))

export const Styled = createStyled(jss)
export const styled = Styled()

export {jss}
export {ThemeProvider}
export default (styles, options = {}) => injectSheet(styles, {...options, isolate: true})
