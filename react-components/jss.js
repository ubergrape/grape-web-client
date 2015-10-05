// Setup jss plugins.
import {Jss} from 'jss'
import reactJss from 'react-jss'
import jssNested from 'jss-nested'
import jssCamelCase from 'jss-camel-case'
import jssPx from 'jss-px'
import jssVendorPrefixer from 'jss-vendor-prefixer'

export let jss = new Jss()
export let useSheet = reactJss(jss)

jss.use(jssNested)
jss.use(jssCamelCase)
jss.use(jssPx)
jss.use(jssVendorPrefixer)

if (__DEV__ || __TEST__) {
  jss.use(require('jss-debug'))
}
