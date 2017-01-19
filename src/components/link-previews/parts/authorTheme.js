import {normal} from 'grape-theme/dist/fonts'

export const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    color: '#b1b6be'
  },
  link: {
    color: '#b1b6be',
    textDecoration: 'none',
    '&:hover, &:focus': {
      textDecoration: 'underline'
    }
  },
  icon: {
    width: normal.fontSize,
    height: normal.fontSize,
    marginRight: 5
  },
  text: {
    lineHeight: 'normal',
    marginTop: 2
  }
}
