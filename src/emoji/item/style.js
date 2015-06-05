import colors from 'grape-theme/base-colors'

export const TAB_ICON = {
  width: '1em',
  height: '1em',
  marginRight: 5
}

let item = {
  display: 'inline-block',
  position: 'relative',
  padding: '6px 7px',
  cursor: 'pointer'
}

export const rules = {
  item: item,
  itemFocused: {
    extend: item,
    background: colors.gainsboroLight,
    borderRadius: 3
  }
}
