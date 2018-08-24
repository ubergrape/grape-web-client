import each from 'lodash/each'
import * as raw from './raw'
import svg2base64 from '../jss-utils/svg2base64'

/**
 * Data image strings.
 */
const data = {}
each(raw, (svg, name) => {
  data[name] = svg2base64(svg)
})
export default data
