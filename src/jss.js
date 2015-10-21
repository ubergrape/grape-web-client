// Setup jss plugins.
import {create} from 'jss'
import reactJss from 'react-jss'
import nested from 'jss-nested'
import camelCase from 'jss-camel-case'
import px from 'jss-px'
import vendorPrefixer from 'jss-vendor-prefixer'

export let jss = create()
export let useSheet = reactJss(jss)

jss.use(nested())
jss.use(camelCase())
jss.use(px())
jss.use(vendorPrefixer())

if (__DEV__ || __TEST__) {
  jss.use(require('jss-debug')())
}

