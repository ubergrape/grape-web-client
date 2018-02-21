import React from 'react'
import {Loading, Communication} from '../i18n'

const LoadingText = ({classes}) => (
  <div className={classes.loading}>
    <span className={classes.title}>
      <Loading />
    </span>
    <span className={classes.text}>
      <Communication />
    </span>
  </div>
)

export default LoadingText
