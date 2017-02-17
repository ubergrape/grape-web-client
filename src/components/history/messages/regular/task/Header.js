import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {small, normal} from 'grape-theme/dist/fonts'
import {ellipsis} from 'grape-web/lib/jss-utils/mixins'
import {grayBlueLighter} from 'grape-theme/dist/base-colors'
import Icon from 'grape-web/lib/svg-icons/Icon'

import IconButton from './IconButton'

@injectSheet({
  header: {
    position: 'relative',
    background: grayBlueLighter,
    padding: 10,
    display: 'flex',
    alignItems: 'flex-start'
  },
  headerTitle: {
    extend: [normal, ellipsis],
    fontWeight: 'bold',
    margin: 0,
    lineHeight: 1
  },
  headerTitleIcon: {
    extend: small,
    marginRight: 5
  },
  headerControlPrev: {
    marginRight: 10
  },
  headerContent: {
    flex: 1
  },
  headerControlClose: {
    width: 16,
    height: 16,
    fontSize: 8
  },
  headerDescr: {
    extend: [small, ellipsis],
    margin: 0
  }
})
export default class Header extends PureComponent {
  render() {
    const {classes, title, description, icon, onPrev, onClose} = this.props
    return (
      <header className={classes.header}>
        {onPrev &&
          <IconButton
            className={classes.headerControlPrev}
            icon="angleLeft"
            onClick={onPrev}
          />
        }
        <div className={classes.headerContent}>
          <h2 className={classes.headerTitle}>
            {icon && <Icon name={icon} className={classes.headerTitleIcon} />}
            {title}
          </h2>
          <p className={classes.headerDescr}>{description}</p>
        </div>
        {onClose &&
          <IconButton
            className={classes.headerControlClose}
            icon="close"
            onClick={onClose}
          />
        }
      </header>
    )
  }
}
