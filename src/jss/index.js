import injectSheet, {jss} from 'react-jss'
import {create} from 'jss'
import isolate from 'jss-isolate'
import extend from 'jss-extend'
import defaultUnit from 'jss-default-unit'
import vendorPrefixer from 'jss-vendor-prefixer'
import propsSort from 'jss-props-sort'
import expand from 'jss-expand'

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

jss.use(isolate({
  reset: {
    'font-family': '"proxima-nova", "Helvetica Neue", Arial, Helvetica, sans-serif',
    'box-sizing': 'border-box'
  }
}))

export {jss, inlineStyle}
export default injectSheet
