import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'

import Tab from './Tab'
import styles from './styles/TabsStyles'

class Tabs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      index: 0,
    }
  }

  handleClick = index => {
    this.setState({ index })
  }

  render() {
    const {
      tabs,
      sheet: { classes },
    } = this.props

    const { index } = this.state
    const { component: TabComponent, actions, data } = tabs[index]

    return (
      <div className={classes.tabs}>
        <ul className={classes.list}>
          {tabs.map((tab, i) => (
            <Tab
              key={tab.name}
              index={i}
              name={tab.name}
              tab={tab}
              disabled={tab.disabled || false}
              isCurrentTab={index === i}
              handleClick={this.handleClick}
            />
          ))}
        </ul>
        <div className={classes.tab}>
          <TabComponent actions={actions} data={data} />
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Tabs)
