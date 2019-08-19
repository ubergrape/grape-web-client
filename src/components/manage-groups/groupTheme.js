import { grayDark } from 'grape-theme/dist/base-colors'

import buttonPrimary from '../button/primary'
import buttonDanger from '../button/danger'

const horizontalSpacing = 20
const btn = {
  marginLeft: horizontalSpacing,
  textTransform: 'capitalize',
}

export const styles = {
  item: {
    color: grayDark,
    display: 'flex',
    padding: [10, horizontalSpacing],
  },
  name: {},
  group: {
    flex: 1,
  },
  joined: {
    extend: [buttonDanger, btn],
  },
  unjoined: {
    extend: [buttonPrimary, btn],
  },
}
