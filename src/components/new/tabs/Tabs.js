import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'

import Tab from './Tab'
import styles from './styles/TabsStyles'

class Tabs extends Component {
  constructor(props) {
    super(props)

    this.state = {
      current: props.current || 0,
    }
  }

  handleClick = current => {
    this.setState({ current })
  }

  render() {
    const {
      tabs,
      sheet: { classes },
    } = this.props

    const { current } = this.state
    const { component: TabComponent, actions, data } = tabs[current]

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
              isCurrentTab={current === i}
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
