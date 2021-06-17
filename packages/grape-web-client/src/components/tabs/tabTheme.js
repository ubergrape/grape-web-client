import { grayBlue } from 'grape-theme/dist/base-colors'
import { link } from 'grape-theme/dist/web-colors'

const border = {
  width: 2,
  style: 'solid',
  color: 'transparent',
}

const active = {
  isolate: false,
  borderBottomColor: link,
  color: link,
  cursor: 'pointer',
}

export const styles = {
  tab: {
    background: 'transparent',
    border: 0,
    borderTop: border,
    borderBottom: border,
    color: grayBlue,
    fontFamily: 'inherit',
    textTransform: 'capitalize',
    padding: [10, 0],
    '&:hover': active,
    '&:focus': active,
  },
  active: {
    extend: active,
    cursor: 'default',
  },
}
