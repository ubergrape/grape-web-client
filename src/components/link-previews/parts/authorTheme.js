import {grayLight} from 'grape-theme/dist/base-colors'

export const styles = {
  container: {
    display: 'flex',
    color: grayLight
  },
  link: {
    textDecoration: 'none',
    '&:hover, &:focus': {
      textDecoration: 'underline'
    }
  },
  icon: {
    height: '1em'
  }
}
