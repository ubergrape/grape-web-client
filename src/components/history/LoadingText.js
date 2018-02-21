import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {spacer} from 'grape-theme/dist/sizes'
import fonts from 'grape-theme/dist/fonts'

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
    extend: fonts.big,
    fontWeight: 600
  },
  text: {
    textAlign: 'center',
    color: palette.grey[800],
    paddingTop: spacer.l,
    extend: fonts.normal,
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
