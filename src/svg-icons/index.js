import * as raw from './raw'

/**
 * Raw svg strings.
 */
export {raw as raw}

/**
 * Data image strings.
 */
export const data = {}
for (const name in raw) {
  data[name] = `data:image/svg+xml;utf8,${raw[name]}`
}

