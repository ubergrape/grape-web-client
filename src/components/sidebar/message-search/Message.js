import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

import Avatar from '../../avatar/Avatar'
import Header from '../../message-parts/Header'
import Bubble from '../../message-parts/Bubble'
import styles from './messageStyles'

@injectSheet(styles)
export default class Message extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.shape({
      time: PropTypes.instanceOf(Date).isRequired,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired,
      avatar: PropTypes.string
    }).isRequired,
    children: PropTypes.node.isRequired,
    onSelect: PropTypes.func.isRequired
  }

  onClick = () => {
    const {message, onSelect} = this.props
    onSelect(message)
  }

  render() {
    const {
      classes,
      message: {author, time, avatar},
      children
    } = this.props

    return (
      <section className={classes.message} onClick={this.onClick}>
        <Header time={time} author={author.name} className={classes.header} />
        <div className={classes.body}>
          <Avatar src={avatar} className={classes.leftColumn} />
          <Bubble className={classes.rightColumn} theme={{classes}}>
            {children}
          </Bubble>
        </div>
      </section>
    )
  }
}
