import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import { spacer } from 'grape-theme/dist/sizes'
import fonts from 'grape-theme/dist/fonts'

import { Loading, Communication } from '../i18n'

const styles = ({ palette }) => ({
  loading: {
    display: 'flex',
    flexDirection: 'column',
    padding: [spacer.xxl * 4, spacer.xl * 2, 0],
  },
  title: {
    extend: fonts.big,
    textAlign: 'center',
    color: palette.grey[800],
    fontWeight: 600,
  },
  text: {
    extend: fonts.normal,
    textAlign: 'center',
    color: palette.grey[800],
    paddingTop: spacer.l,
    lineHeight: '150%',
  },
})

const LoadingText = ({ classes }) => (
  <div className={classes.loading}>
    <span className={classes.title}>
      <Loading />
    </span>
    <span className={classes.text}>
      <Communication />
    </span>
  </div>
)

export default injectSheet(styles)(LoadingText)
