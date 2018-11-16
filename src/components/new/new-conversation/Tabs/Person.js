import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'
import debounce from 'lodash/debounce'
import { debouncingTime } from 'grape-web/lib/constants/time'

import { InputSearch } from '../../input'
import { InfiniteAutoRowHeightList } from '../../list'
import NoRowsRendererUsers from '../NoRowsRenderers/NoRowsRendererUsers'
import RowRendererUsers from '../RowRenderers/RowRendererUsers'
import styles from '../styles/TabStyles'

class Person extends Component {
  onChangeFilterDebounced = debounce(value => {
    this.props.actions.changeInputUsersNewConversation(value)
    this.props.actions.searchUsersNewConversation()
  }, debouncingTime)

  onChange = ({ target }) => {
    const { value } = target
    this.onChangeFilterDebounced(value)
  }

  isRowLoaded = index => !!this.props.data.users[index]

  rowHeight = (list, index) => {
    if (list[index].text) return 70
    return 40
  }

  render() {
    const { classes, data, actions } = this.props
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
              actions.searchUsersNewConversation()
            }}
            isRowLoaded={this.isRowLoaded}
            list={data.users}
            rowCount={Infinity}
            minimumBatchSize={50}
            width={680}
            threshold={30}
            rowRenderer={(index, key, style) => (
              <RowRendererUsers
                data={data}
                index={index}
                key={key}
                style={style}
              />
            )}
            noRowsRenderer={() => (
              <NoRowsRendererUsers isLoaded={data.isLoaded} />
            )}
          />
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Person)
