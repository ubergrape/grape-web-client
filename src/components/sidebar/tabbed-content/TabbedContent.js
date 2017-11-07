import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import Tabs, {Tab} from 'material-ui/Tabs'
import sizes from 'grape-theme/dist/sizes'

import {spacing} from '../constants'

@injectSheet(({palette}) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  },
  tabs: {
    flexShrink: 0,
    borderTop: [1, 'solid', palette.text.divider],
    borderBottom: [1, 'solid', palette.text.divider],
    background: palette.blueGrey[100],
    padding: [0, spacing]
  },
  tab: {
    textAlign: 'center',
    minWidth: 40,
    height: 38,
    marginRight: spacing,
    color: palette.text.secondary,
    opacity: 1
  },
  tabSelected: {
    color: palette.accent.A200
  },
  indicator: {
    isolate: false,
    height: 4,
    borderRadius: [2, 2, 0, 0]
  },
  icon: {
    height: sizes.icon.m,
    color: 'inherit',
    cursor: 'inherit'
  },
  content: {
    display: 'block',
    flex: 1
  }
}))
export default class TabbedContent extends PureComponent {
  static defaultProps = {
    value: 0
  }

  onChange = (e, value) => {
    this.props.onChange(value)
  }

  render() {
    const {children, value, classes} = this.props

    const tabClasses = {rootInheritSelected: classes.tabSelected}

    return (
      <section className={classes.root}>
        <Tabs
          index={value}
          onChange={this.onChange}
          className={classes.tabs}
          indicatorClassName={classes.indicator}
        >
          <Tab
            icon={<Icon name="accountGroup" className={classes.icon} />}
            className={classes.tab}
            classes={tabClasses}
          />
          <Tab
            icon={<Icon name="folderPicture" className={classes.icon} />}
            className={classes.tab}
            classes={tabClasses}
          />
        </Tabs>
        <div className={classes.content}>
          {children}
        </div>
      </section>
    )
  }
}
