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
    display: 'inline-block',
    border: 0,
    fontSize: 0,
    lineHeight: 0,
    userSelect: 'none',
    marginLeft: 10,
    '&:first-child': {
      marginLeft: 0,
    },
    opacity: 0.7,
    '&:hover, &:focus': {
      opacity: 1,
    },
  },
  playIcon: create('play', { size: 70, color: white }),
  externalLinkIcon: create('external', { size: 70, color: white }),
}
