import jss from 'jss'
import jssCamelCase from 'jss-camel-case'
import jssPx from 'jss-px'
import jssVendorPrefixer from 'jss-vendor-prefixer'
import jssExtend from 'jss-extend'

// Setup jss plugins.
jss.use(jssCamelCase)
jss.use(jssPx)
jss.use(jssVendorPrefixer)
jss.use(jssExtend)
