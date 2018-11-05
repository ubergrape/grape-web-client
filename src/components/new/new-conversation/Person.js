import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'
import debounce from 'lodash/debounce'
import { debouncingTime } from 'grape-web/lib/constants/time'

import { InputSearch } from '../input'
import { InfiniteAutoRowHeightList } from '../list'
import NoRowsRenderer from './NoRowsRenderer'
import RowRenderer from './RowRenderer'
import styles from './styles/TabStyles'

class Person extends Component {
  onChangeFilterDebounced = debounce(value => {
    this.props.data.changeInputNewConversation(value)
    this.props.data.searchUsersNewConversation()
  }, debouncingTime)

  onChange = ({ target }) => {
    const { value } = target
    this.onChangeFilterDebounced(value)
  }

  isRowLoaded = index => !!this.props.data.users[index]

  rowHeight = (list, index) => {
    if (list[index].height) return list[index].height
    return 40
  }

  render() {
    const { classes, data } = this.props
    return (
      <div className={classes.tab}>
        <div className={classes.input}>
          <InputSearch
            onChange={this.onChange}
            placeholder="Search for a person ..."
            defaultValue={data.filterUsers}
            type="search"
          />
        </div>
        <div className={classes.list}>
          <InfiniteAutoRowHeightList
            rowHeight={this.rowHeight}
            loadMoreRows={() => {
              data.searchUsersNewConversation()
            }}
            isRowLoaded={this.isRowLoaded}
            list={data.users}
            rowCount={1000}
            minimumBatchSize={50}
            width={680}
            threshold={30}
            rowRenderer={(index, key, style) => (
              <RowRenderer data={data} index={index} key={key} style={style} />
            )}
            noRowsRenderer={() => <NoRowsRenderer isLoaded={data.isLoaded} />}
          />
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Person)
