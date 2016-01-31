// Setup jss plugins.
import {create} from 'jss'
import reactJss from 'react-jss'
import nested from 'jss-nested'
import camelCase from 'jss-camel-case'
import defaultUnit from 'jss-default-unit'
import vendorPrefixer from 'jss-vendor-prefixer'

export const jss = create()
export const useSheet = reactJss(jss)

jss.use(nested())
jss.use(camelCase())
jss.use(defaultUnit())
jss.use(vendorPrefixer())
