import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { smallest, small, normal } from 'grape-theme/dist/fonts'
import { ellipsis } from 'grape-web/lib/jss-utils/mixins'
import { grayBlueLighter } from 'grape-theme/dist/base-colors'
import Icon from 'grape-web/lib/svg-icons/Icon'

import IconButton from './IconButton'

const iconSize = {
  width: 16,
  height: 16,
}

@injectSheet({
  header: {
    position: 'relative',
    background: grayBlueLighter,
    padding: 10,
    display: 'flex',
    alignItems: 'flex-start',
  },
  headerTitle: {
    extend: [normal, ellipsis],
    fontWeight: 'bold',
    margin: 0,
    marginBottom: 5,
    lineHeight: 1,
  },
  headerTitleIcon: {
    extend: small,
    marginRight: 5,
  },
  headerControlPrev: iconSize,
  headerContent: {
    flex: 1,
    overflow: 'hidden',
  },
  headerControlClose: {
    extend: iconSize,
    fontSize: smallest.fontSize,
  },
  headerDescr: {
    extend: [small, ellipsis],
    whiteSpace: 'pre-line',
    margin: 0,
    maxHeight: small.fontSize * small.lineHeight * 2,
  },
})
export default class Header extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    title: PropTypes.node.isRequired,
    description: PropTypes.string,
    icon: PropTypes.string,
    onGoBack: PropTypes.func,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    description: null,
    icon: null,
    onGoBack: null,
    onClose: null,
  }

  render() {
    const { classes, title, description, icon, onGoBack, onClose } = this.props
    return (
      <header className={classes.header}>
        {onGoBack && (
          <IconButton
            className={classes.headerControlPrev}
            icon="angleLeft"
            onClick={onGoBack}
          />
        )}
        <div className={classes.headerContent}>
          <h2 className={classes.headerTitle}>
            {icon && <Icon name={icon} className={classes.headerTitleIcon} />}
            {title}
          </h2>
          <p className={classes.headerDescr}>{description}</p>
        </div>
        {onClose && (
          <IconButton
            className={classes.headerControlClose}
            icon="close"
            onClick={onClose}
          />
        )}
      </header>
    )
  }
}
