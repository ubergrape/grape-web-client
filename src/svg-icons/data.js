import each from 'lodash/collection/each'
import * as raw from './raw'
import toData from './toData'

/**
 * Data image strings.
 */
const data = {}
each(raw, (svg, name) => data[name] = toData(svg))
export default data
