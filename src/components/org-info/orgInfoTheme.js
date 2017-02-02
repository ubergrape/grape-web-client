import {small, normal} from 'grape-theme/dist/fonts'
import {grayLight, black} from 'grape-theme/dist/base-colors'
import {borderDefault} from 'grape-theme/dist/web-colors'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'

import {height as headerHeight} from '../header'

const header = {
  extend: ellipsis,
  lineHeight: 'initial'
}

export const logoSize = 32

export const styles = {
  orgInfo: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: {
      right: 10,
      left: 20
    },
    height: headerHeight,
    borderBottom: [1, 'solid', borderDefault],
    flexShrink: 0
  },
  headers: {
    flexGrow: 1,
    overflow: 'hidden',
    marginRight: 10,
    cursor: 'default'
  },
  logoContainer: {
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    marginRight: 10,
    borderRadius: '50%',
    width: logoSize,
    height: logoSize
  },
  logoImage: {
    widht: '100%',
    height: '100%'
  },
  orgName: {
    extend: [normal, header],
    lineHeight: 1,
    color: black
  },
  userName: {
    extend: [small, header],
    color: grayLight
  }
}
