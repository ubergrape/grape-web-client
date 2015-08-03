import colors from 'grape-theme/dist/base-colors'

export const TAB_ICON = {
  width: '1.539em',
  height: '1.539em',
  marginRight: 5
}

let item = {
  display: 'inline-block',
  position: 'relative',
  padding: '6px 7px',
  cursor: 'pointer'
}

export const rules = {
  item: item,
  itemFocused: {
    ...item,
    background: colors.gainsboroLight,
    borderRadius: 3
  }
}
