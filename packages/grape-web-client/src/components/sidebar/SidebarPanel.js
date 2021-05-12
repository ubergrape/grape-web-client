import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import fonts from 'grape-theme/dist/fonts'
import baseColors from 'grape-theme/dist/base-colors'
import IconButton from 'grape-web/lib/components/icon-button'
import Icon from 'grape-web/lib/svg-icons/Icon'
import cn from 'classnames'

import { zIndex } from '../../utils/z-index'
import { spacing } from './constants'
import Title from './Title'

/**
 * Dialog has
 * - header (title, close button)
 * - body
 * - positioned in the middle
 */
@injectSheet(({ palette }) => ({
  title: {
    flex: 2,
    alignSelf: 'center',
  },
  sidebarPanel: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    background: baseColors.grayBlueLighter,
    maxHeight: '100%',
  },
  header: {
    display: 'flex',
    flexShrink: 0,
    borderBottom: [1, 'solid', palette.text.divider],
    // Used to overlap absolutely positioned content e.g. loading indicator.
    position: 'relative',
    zIndex: zIndex('base'),
  },
  headerWithOptions: {
    marginLeft: 0,
  },
  titleWithOptions: {
    paddingLeft: spacing,
  },
  body: {
    position: 'relative',
    background: baseColors.grayBlueLighter,
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100%',
  },
  close: {
    isolate: false,
    fontSize: fonts.small.fontSize,
    color: palette.text.primary,
  },
  icon: {
    '&:hover': {
      cursor: 'pointer',
      height: '1em',
      width: '1em',
      color: ({ colors }) => colors.button || palette.secondary.A200,
    },
  },
}))
export default class SidebarPanel extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
    options: PropTypes.node,
    children: PropTypes.node,
  }

  static defaultProps = {
    options: undefined,
    children: undefined,
  }

  render() {
    const { options, title, children, classes, onClose } = this.props
    return (
      <div className={classes.sidebarPanel}>
        <header
          className={cn(classes.header, options && classes.headerWithOptions)}
        >
          <Title className={classes.title}>{title}</Title>
          <IconButton className={classes.close} onClick={onClose}>
            <Icon className={classes.icon} name="close" />
          </IconButton>
        </header>
        {options}
        <div className={classes.body}>{children}</div>
      </div>
    )
  }
}
