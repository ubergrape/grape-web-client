import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {spacer} from 'grape-theme/dist/sizes'

import {Loading, Communication} from '../i18n'

@injectSheet(({palette}) => ({
  loading: {
    display: 'flex',
    flexDirection: 'column',
    padding: [spacer.xxl * 4, spacer.xl * 2, 0]
  },
  title: {
    textAlign: 'center',
    color: palette.grey[800],
    fontSize: 17,
    fontWeight: 600
  },
  text: {
    textAlign: 'center',
    color: palette.grey[800],
    paddingTop: spacer.l,
    fontSize: 15,
    lineHeight: '150%'
  }
}))
export default class LoadingText extends PureComponent {
  render() {
    const {classes} = this.props
    return (
      <div className={classes.loading}>
        <span className={classes.title}>
          <Loading />
        </span>
        <span className={classes.text}>
          <Communication />
        </span>
      </div>
    )
  }
}
