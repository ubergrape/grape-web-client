import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'
import debounce from 'lodash/debounce'
import { debouncingTime } from 'grape-web/lib/constants/time'

import { InputSearch } from '../../input'
import { InfiniteAutoRowHeightList } from '../../list'
import NoRowsRendererGroups from '../NoRowsRenderers/NoRowsRendererGroups'
import RowRendererGroups from '../RowRenderers/RowRendererGroups'
import styles from '../styles/TabStyles'

class Group extends Component {
  onChangeFilterDebounced = debounce(value => {
    this.props.actions.changeInputGroupsNewConversation(value)
    this.props.actions.searchGroupsNewConversation()
  }, debouncingTime)

  onChange = ({ target }) => {
    const { value } = target
    this.onChangeFilterDebounced(value)
  }

  isRowLoaded = index => !!this.props.data.groups[index]

  rowHeight = (list, index) => {
    if (list[index].text) return 70
    return 40
  }

  render() {
    const { classes, data, actions } = this.props
    return (
      <div className={classes.tab}>
        <span className={classes.hint}>
          Join an existing group or create a new one. Groups are best organized
          around a topic.
        </span>
        <button className={classes.button}>Create a new group</button>
        <div className={classes.input}>
          <InputSearch
            onChange={this.onChange}
            placeholder="Search for a group ..."
            defaultValue={data.filterGroups}
            type="search"
          />
        </div>
        <div className={classes.list}>
          <InfiniteAutoRowHeightList
            rowHeight={this.rowHeight}
            loadMoreRows={() => {
              actions.searchGroupsNewConversation()
            }}
            isRowLoaded={this.isRowLoaded}
            list={data.groups}
            rowCount={Infinity}
            minimumBatchSize={50}
            width={680}
            threshold={30}
            rowRenderer={(index, key, style) => (
              <RowRendererGroups
                data={data}
                index={index}
                key={key}
                style={style}
              />
            )}
            noRowsRenderer={() => (
              <NoRowsRendererGroups isLoaded={data.isLoaded} />
            )}
          />
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Group)
