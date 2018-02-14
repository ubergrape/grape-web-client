import injectSheet, {jss, ThemeProvider, JssProvider} from 'react-jss'
import {create} from 'jss'
import isolate from 'jss-isolate'
import extend from 'jss-extend'
import defaultUnit from 'jss-default-unit'
import vendorPrefixer from 'jss-vendor-prefixer'
import propsSort from 'jss-props-sort'
import expand from 'jss-expand'
import increaseSpecificity from 'jss-increase-specificity'
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
jss.options.insertionPoint = 'grape-jss'

jss
  .use(increaseSpecificity({repeat: 1}))
  .use(isolate({
    isolate: false,
    reset: ['all', {
      display: 'inline-block',
      fontFamily: typographyConstants.fontFamily,
      fontSize: typographyConstants.fontSize,
      boxSizing: 'border-box',
      textRendering: 'optimizeLegibility',
      color: palette.text.primary
    }]
  }))

export const Styled = createStyled(jss)
export const styled = Styled()

export {JssProvider, ThemeProvider, jss}

export default (styles, options = {}) => injectSheet(styles, {
  inject: ['classes', 'sheet', 'theme'],
  isolate: true,
  ...options
})
