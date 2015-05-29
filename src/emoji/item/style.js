import colors from 'grape-theme/base-colors'

export const MARGIN = 3

let item = {
  display: 'inline-block',
  margin: MARGIN,
  padding: 2
}

export const rules = {
  item: item,
  itemFocused: {
    extend: item,
    background: colors.silverDark
  }
}
