import React, {Component} from 'react'

import {useSheet} from '../jss'
import style from './style'

@useSheet(style)
export default class FileBrowser extends Component {
  render() {
    const {classes} = this.props.sheet
    return (
      <section className={classes.file}>
        <div className={classes.leftColumn}>
          <span className={classes.icon}></span>
        </div>
        <div className={classes.rightColumn}>
          <h2 className={classes.name}>{this.props.name}</h2>
          <p className={classes.meta}></p>
          <p className={classes.channel}></p>
        </div>
      </section>
    )
  }
}
