import { isElectron } from './electron'

export default conf => {
  let mode = conf.embed ? 'embedded' : 'full'
  if (isElectron) mode = 'electron'
  return mode
}
