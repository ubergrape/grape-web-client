import {small} from 'grape-theme/dist/fonts'

export const styles = {
  badge: {
    ...small,
    display: 'inline-block',
    padding: '2px 8px',
    // FIXME: replace with theme colors.
    background: '#e6c647',
    color: '#fff',
    borderRadius: '1pc',
    marginLeft: 5,
    alignSelf: 'flex-start'
  }
}
