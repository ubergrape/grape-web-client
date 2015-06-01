import colors from 'grape-theme/base-colors'

export const TAB_ICON = {
  width: '1em',
  height: '1em',
  marginRight: 5
}

let item = {
  display: 'inline-block',
  position: 'relative',
  padding: 7
}

export const rules = {
  item: item,
  itemFocused: {
    extend: item,
    background: 'red',
    borderRadius: 3
  }
}
