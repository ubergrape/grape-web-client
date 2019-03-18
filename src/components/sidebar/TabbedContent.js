import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import Tabs from 'grape-web/lib/components/tabs/tabs'
import Tab from 'grape-web/lib/components/tabs/tab'
import sizes from 'grape-theme/dist/sizes'

import { spacing } from './constants'
import Title from './Title'

@injectSheet(({ palette }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  tabs: {
    flexShrink: 0,
    borderTop: [1, 'solid', palette.text.divider],
    borderBottom: [1, 'solid', palette.text.divider],
    background: palette.blueGrey[100],
    padding: [0, spacing],
    minHeight: 0,
  },
  tab: {
    textAlign: 'center',
    minWidth: 40,
    height: 38,
    marginRight: spacing,
    color: palette.text.secondary,
    opacity: 1,
  },
  tabInherit: {
    '@media (min-width: 960px)': {
      minWidth: 40,
    },
  },
  tabSelected: {
    color: ({ colors }) => colors.button || palette.secondary.A200,
  },
  indicator: {
    isolate: false,
    height: 4,
    borderRadius: [2, 2, 0, 0],
  },
  icon: {
    fontSize: sizes.icon.m,
    color: 'inherit',
    cursor: 'inherit',
  },
  content: {
    display: 'block',
    flex: 1,
  },
  header: {
    display: 'block',
    borderBottom: [1, 'solid', palette.text.divider],
  },
  body: {
    display: 'block',
    padding: spacing,
  },
}))
export default class TabbedContent extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    colors: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.string.isRequired,
      }),
    ).isRequired,
    index: PropTypes.number,
    title: PropTypes.node,
    body: PropTypes.node,
  }

  static defaultProps = {
    index: 0,
    title: undefined,
    body: undefined,
  }

  onChange = (e, index) => {
    this.props.onChange(index)
  }

  render() {
    const { index, classes, tabs, title, body, colors } = this.props

    const tabClasses = {
      rootInheritSelected: classes.tabSelected,
      root: classes.tabInherit,
    }

    return (
      <section className={classes.root}>
        <Tabs
          value={index}
          onChange={this.onChange}
          className={classes.tabs}
          indicatorColor={colors.button}
          indicatorClassName={classes.indicator}
        >
          {tabs.map(({ name, icon }) => (
            <Tab
              key={name}
              icon={<Icon name={icon} className={classes.icon} />}
              className={classes.tab}
              classes={tabClasses}
            />
          ))}
        </Tabs>
        <div className={classes.content}>
          <header className={classes.header}>
            <Title>{title}</Title>
          </header>
          <div className={classes.body}>{body}</div>
        </div>
      </section>
    )
  }
}
