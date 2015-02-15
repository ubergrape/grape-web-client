// Setup jss plugins.
import jss from 'jss'
import jssExtend from 'jss-extend'
import jssNested from 'jss-nested'
import jssCamelCase from 'jss-camel-case'
import jssPx from 'jss-px'
import jssVendorPrefixer from 'jss-vendor-prefixer'
jss.use(jssExtend)
jss.use(jssNested)
jss.use(jssCamelCase)
jss.use(jssPx)
jss.use(jssVendorPrefixer)
