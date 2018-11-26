import React, { Component } from 'react'
import injectSheet from 'grape-web/lib/jss'
import debounce from 'lodash/debounce'
import { debouncingTime } from 'grape-web/lib/constants/time'

import { InputSearch } from '../../input'
import { InfiniteAutoRowHeightList } from '../../list'
import NoRowsRendererGroups from '../NoRowsRenderers/NoRowsRendererGroups'
import RowRendererGroups from '../RowRenderers/RowRendererGroups'
import EmptyOrgGroups from '../EmptyOrg/EmptyOrgGroups'
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

    if (!data.groups.length && data.isLoaded) return <EmptyOrgGroups />

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
        {data.isMemberOfEachChannel && (
          <div>
            <h3 className={classes.title}>You won’t miss any chat going on!</h3>
            <p className={classes.text}>
              You are already part of every existing group in this organization,
              there is nothing that can be publicly said without your notice.
              You may want to keep the conversations going on.
            </p>
          </div>
        )}
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
