import * as browsers from './src'

// Register reactive element.
if (document.registerReact) {
  document.registerReact('grape-search-browser', browsers.SearchBrowser)
  document.registerReact('grape-emoji-browser', browsers.EmojiBrowser)
}

// Setup jss plugins.
import jss from 'jss'
import jssExtend from 'jss-extend'
import jssNested from 'jss-nested'
import jssCamelCase from 'jss-camel-case'
import jssPx from 'jss-px'
import jssVendorPrefixer from 'jss-vendor-prefixer'
import jssDebug from 'jss-debug'
jss.use(jssExtend)
jss.use(jssNested)
jss.use(jssCamelCase)
jss.use(jssPx)
jss.use(jssVendorPrefixer)
jss.use(jssDebug)
