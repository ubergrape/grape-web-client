import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'

import Tab from './Tab'

const styles = {
  list: {
    display: 'flex',
    listStyleType: 'none',
    marginTop: 25,
  },
  tab: {
    marginTop: 16,
  },
}

class Tabs extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      value: 0,
    }
  }

  handleClick = value => {
    this.setState({ value })
  }

  render() {
    const {
      tabs,
      sheet: { classes },
    } = this.props
    const { value } = this.state
    return (
      <div>
        <ul className={classes.list}>
          {tabs.map((tab, i) => (
            <Tab
              key={tab.name}
              index={i}
              name={tab.name}
              isCurrentTab={value === i}
              handleClick={this.handleClick}
            />
          ))}
        </ul>
        <div className={classes.tab}>{tabs[value].component()}</div>
      </div>
    )
  }
}

export default injectSheet(styles)(Tabs)
