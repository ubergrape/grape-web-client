import PropTypes from 'prop-types'
import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { icon as iconSize, spacer } from 'grape-theme/dist/sizes'
import { noop } from 'lodash'
import cn from 'classnames'

import Avatar from '../avatar/Avatar'
import Header from '../message-parts/Header'
import Bubble from '../message-parts/Bubble'
import contentStyles from '../message-parts/contentStyles'

const arrowWidth = 7
const marginRight = 10
const shadowColor = 'rgba(0,0,0,0.3)'
const transition = 'box-shadow 150ms ease-out'

class Message extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    message: PropTypes.shape({
      time: PropTypes.string.isRequired,
      author: PropTypes.shape({
        name: PropTypes.string.isRequired,
      }).isRequired,
      avatar: PropTypes.string,
    }).isRequired,
    children: PropTypes.node.isRequired,
    onSelect: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onRefContent: PropTypes.func,
    renderMenu: PropTypes.func,
    className: PropTypes.string,
  }

  static defaultProps = {
    onSelect: noop,
    onMouseLeave: noop,
    onMouseEnter: noop,
    renderMenu: noop,
    onRefContent: undefined,
    className: undefined,
  }

  onSelectMessage = () => {
    const { message, onSelect } = this.props
    onSelect(message)
  }

  render() {
    const {
      classes,
      message: { author, time, avatar },
      renderMenu,
      onMouseEnter,
      onMouseLeave,
      onRefContent,
      className,
      children,
    } = this.props

    return (
      <section className={cn(classes.message, className)}>
        <Header time={time} author={author.name} className={classes.header} />
        <div className={classes.body}>
          <Avatar src={avatar} className={classes.leftColumn} />
          <Bubble
            className={classes.rightColumn}
            theme={{ classes }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <button
              className={classes.innerContent}
              ref={onRefContent}
              onClick={this.onSelectMessage}
            >
              {children}
            </button>
            {renderMenu()}
          </Bubble>
        </div>
      </section>
    )
  }
}

export default injectSheet({
  message: {
    display: 'block',
    cursor: 'pointer',
    // Stronger selector because `contentStyles` contains declarations for tags
    // with an isolation, so we need to be stronger here.
    // TODO think of something better.
    '&& *': {
      isolate: false,
      cursor: 'pointer',
    },
  },
  body: {
    display: 'flex',
  },
  header: {
    marginTop: spacer.m,
    paddingLeft: iconSize.l + marginRight + arrowWidth,
  },
  leftColumn: {
    flexShrink: 0,
    marginRight,
  },
  rightColumn: {
    flex: 1,
    width: '100%',
  },
  bubble: {
    '&:hover:before': {
      transition,
      boxShadow: `-3px 4px 8px ${shadowColor}`,
    },
  },
  content: {
    transition,
    '&:hover': {
      isolate: false,
      boxShadow: `0px 1px 8px ${shadowColor}`,
    },
  },
  innerContent: {
    ...contentStyles,
    width: '100%',
    '& p, & strong, & span': {
      isolate: false,
      display: 'inline',
    },
  },
})(Message)
