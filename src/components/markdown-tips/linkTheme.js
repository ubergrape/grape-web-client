import {gray} from 'grape-theme/dist/base-colors'

const hoverStyles = {
  opacity: 0.8,
  // TODO remove this when legacy/global CSS is gone
  cursor: 'pointer',
  font: 'inherit'
}

export const styles = {
  button: {
    color: gray,
    cursor: 'pointer',
    border: 0,
    font: 'inherit',
    padding: 0,
    textDecoration: 'underline',
    '&:hover': hoverStyles,
    '&:focus': hoverStyles
  }
}
