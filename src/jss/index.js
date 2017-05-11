import injectSheet, {jss} from 'react-jss'
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

jss
  .setup({insertionPoint: 'grape-jss'})
  .use(isolate({
    reset: {
      'font-family': typographyConstants.fontFamily,
      'box-sizing': 'border-box',
      // Can be removed after at v3 of jss-isolate.
      'word-break': 'normal',
      color: palette.text.primary
    }
  }))

export const Styled = createStyled(jss)
export const styled = Styled()

export {jss}
export default injectSheet
