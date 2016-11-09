import color from 'color'
import {small, normal} from 'grape-theme/dist/fonts'
import {grayLight, blue, black} from 'grape-theme/dist/base-colors'
import {borderDefault} from 'grape-theme/dist/web-colors'
import mixins from 'grape-web/lib/jss-utils/mixins'

import buttonIcon from '../button/icon'
import {height as headerHeight} from '../header'

const headers = {
  ...mixins.ellipsis,
  lineHeight: 'initial'
}

export const styles = {
  orgInfo: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: '0 10px 0 20px',
    height: headerHeight,
    borderBottom: `1px solid ${borderDefault}`
  },
  headers: {
    flexGrow: 1,
    overflow: 'hidden',
    marginRight: 10,
    cursor: 'default'
  },
  logo: {
    flexShrink: 0,
    position: 'relative',
    overflow: 'hidden',
    marginRight: 10,
    borderRadius: '50%'
  },
  orgName: {
    extend: [normal, headers],
    lineHeight: 1,
    color: black
  },
  userName: {
    extend: [small, headers],
    color: grayLight
  },
  settings: {
    extend: buttonIcon('cog', {
      color: blue,
      hoverColor: color(blue).lighten(0.2).rgbaString(),
      iconOnly: true
    }),
    fontSize: 18,
    lineHeight: 'inherit'
  }
}
