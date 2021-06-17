import { rgba } from 'css-functions'
import { white } from 'grape-theme/dist/base-colors'
import { borderRadius } from 'grape-theme/dist/sizes'

import create from '../../../inline-icon/create'

export const styles = {
  container: {
    padding: 10,
    borderRadius: borderRadius.bigger,
    backgroundColor: rgba(0, 0, 0, 0.7),
    whiteSpace: 'nowrap',
  },
  action: {
    border: 0,
    fontSize: 0,
    lineHeight: 0,
    userSelect: 'none',
    opacity: 0.7,
    '&:first-child': {
      isolate: false,
      marginRight: 10,
    },
    '&:hover, &:focus': {
      opacity: 1,
      '&:first-child': {
        marginRight: 10,
      },
    },
  },
  playIcon: create('play', { size: 70, color: white, cursor: 'pointer' }),
  externalLinkIcon: create('external', {
    size: 70,
    color: white,
    cursor: 'pointer',
  }),
}
