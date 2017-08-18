import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {small, big} from 'grape-theme/dist/fonts'
import colors from 'grape-theme/dist/base-colors'
import webColors from 'grape-theme/dist/web-colors'
import IconButton from 'material-ui/IconButton'
import Icon from 'grape-web/lib/svg-icons/Icon'
import cn from 'classnames'

import {zIndex} from '../../../utils/z-index'
import {spacing} from '../constants'


/**
 * Dialog has
 * - header (title, close button)
 * - body
 * - positioned in the middle
 */
@injectSheet({
  title: {
    extend: [big, ellipsis],
    flex: 2,
    alignSelf: 'center',
    color: colors.gray,
    padding: [14, spacing, 14, 0],
    margin: 0
  },
  sidebarPanel: {
    alignItems: 'stretch',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    background: colors.grayBlueLighter,
    maxHeight: '100%'
  },
  header: {
    display: 'flex',
    flexShrink: 0,
    borderBottom: [1, 'solid', webColors.borderDefault],
    // Used to overlap absolutely positioned content e.g. loading indicator.
    position: 'relative',
    zIndex: zIndex('base'),
    marginLeft: spacing
  },
  headerWithOptions: {
    marginLeft: 0
  },
  titleWithOptions: {
    paddingLeft: spacing
  },
  body: {
    position: 'relative',
    background: colors.grayBlueLighter,
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    height: '100%'
  },
  close: {
    isolate: false,
    fontSize: small.fontSize,
    opacity: 0.5,
    '&:hover': {
      isolate: false,
      opacity: 1
    }
  }
})
export default class SidebarPanel extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    options: PropTypes.node,
    children: PropTypes.node
  }

  static defaultProps = {
    options: undefined,
    children: undefined
  }

  render() {
    const {options, title, children, classes, onClose} = this.props
    return (
      <div className={classes.sidebarPanel}>
        <header className={cn(classes.header, options && classes.headerWithOptions)}>
          <h2 className={cn(classes.title, options && classes.titleWithOptions)}>
            {title}
          </h2>
          <IconButton className={classes.close} onClick={onClose}>
            <Icon name="close" />
          </IconButton>
        </header>
        {options}
        <div className={classes.body}>
          {children}
        </div>
      </div>
    )
  }
}
