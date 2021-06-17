import createMuiTheme from 'material-ui/styles/createMuiTheme'
import merge from 'lodash/merge'
import palette from './palette'
import zIndex from './zIndex'
import typography, { constants as typographyConstants } from './typography'
import * as overrides from './overrides'
import './setupDefaults'

export { palette, typography, typographyConstants }

export const create = theme =>
  createMuiTheme(
    merge(
      {
        typography,
        palette,
        overrides,
        zIndex,
      },
      theme,
    ),
  )

export default create()
