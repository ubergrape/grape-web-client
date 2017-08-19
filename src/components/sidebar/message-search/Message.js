import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {gainsboroLight, grayDark} from 'grape-theme/dist/base-colors'
import omit from 'lodash/object/omit'
import {icon as iconSize} from 'grape-theme/dist/sizes'

import Avatar from '../../avatar/Avatar'
import Header from '../../message-parts/Header'
import Bubble from '../../message-parts/Bubble'
import {styles as linkStyles} from '../../message-parts/linkTheme'

const arrowWidth = 7
const marginRight = 10
const shadowColor = 'rgba(0,0,0,0.3)'
const transition = 'box-shadow 150ms ease-out'
const link = omit(linkStyles.link, '&:hover')
const linkHover = linkStyles.link['&:hover']

@injectSheet({
  message: {
    cursor: 'pointer',
    margin: [0, 0, 15]
  },
  body: {
    display: 'flex'
  },
  header: {
    paddingLeft: iconSize.l + marginRight + arrowWidth
  },
  leftColumn: {
    flexShrink: 0,
    marginRight
  },
  rightColumn: {
    flex: 1,
    width: '100%'
  },
  bubble: {
    '&:hover:before': {
      transition,
      boxShadow: `-3px 4px 8px ${shadowColor}`
    }
  },
  content: {
    transition,
    '&:hover': {
      isolate: false,
      boxShadow: `0px 1px 8px ${shadowColor}`
    }
  },
  innerContent: {
    overflow: 'hidden',
    '& a': link,
    '& a:hover': linkHover,
    '& pre': {
      display: 'block',
      color: grayDark,
      border: `1px solid ${gainsboroLight}`
    }
  }
})
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
            <div className={classes.innerContent}>
              {children}
            </div>
          </Bubble>
        </div>
      </section>
    )
  }
}
