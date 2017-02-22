import injectSheet, {jss} from 'react-jss'
import {create} from 'jss'
import isolate from 'jss-isolate'
import extend from 'jss-extend'
import defaultUnit from 'jss-default-unit'
import vendorPrefixer from 'jss-vendor-prefixer'
import propsSort from 'jss-props-sort'
import expand from 'jss-expand'
import {typographyConstants} from '../mui-theme'

const jssInline = create({
  plugins: [
    extend(),
    defaultUnit(),
    expand(),
    vendorPrefixer(),
    propsSort()
  ]
})

const inlineStyle = style => jssInline.createRule(style).toJSON()

jss
  .setup({insertionPoint: 'grape-jss'})
  .use(isolate({
    reset: {
      'font-family': typographyConstants.fontFamily,
      'box-sizing': 'border-box'
    }
  }))

export {jss, inlineStyle}
export default injectSheet
