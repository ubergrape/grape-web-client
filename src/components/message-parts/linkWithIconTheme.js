import {styles as linkStyles} from './linkTheme'

export const {color} = linkStyles.link
export const styles = {
  ...linkStyles,
  icon: {
    display: 'inline-block',
    background: 'no-repeat',
    backgroundSize: 'contain',
    width: '1em',
    height: '1em'
  }
}
