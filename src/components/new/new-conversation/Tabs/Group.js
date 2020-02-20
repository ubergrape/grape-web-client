import React, { Component } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import { debounce } from 'lodash'
import { debouncingTime } from 'grape-web/lib/constants/time'

import { IconButton } from '../../buttons'
import { InfiniteAutoRowHeightList } from '../../list'
import NoRowsRendererGroups from '../NoRowsRenderers/NoRowsRendererGroups'
import RowRendererGroups from '../RowRenderers/RowRendererGroups'
import EmptyOrgGroups from '../EmptyOrg/EmptyOrgGroups'
import InputSearch from '../../input/InputSearch'
import styles from '../styles/TabStyles'

class Group extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  }

  onChangeFilterDebounced = debounce(value => {
    const { onChangeGroupsFilter, onSearchGroups } = this.props.actions
    onChangeGroupsFilter(value)
    onSearchGroups()
  }, debouncingTime)

  onChangeFilter = ({ target }) => {
    const { value } = target
    this.onChangeFilterDebounced(value)
  }

  onClickCreate = () => {
    this.props.actions.onChangeView('create')
  }

  isRowLoaded = index => Boolean(this.props.data.list[index])

  rowHeight = (list, index) => {
    if (list[index].text) return 70
    return 40
  }

  render() {
    const { classes, data, actions } = this.props
    const { list, isGroupsLoaded, filterGroups, isMemberOfEachChannel } = data

    if (!list.length && isGroupsLoaded && !filterGroups)
      return <EmptyOrgGroups onClick={this.onClickCreate} />

    return (
      <div className={classes.tab}>
        <span className={classes.hint}>
          Join an existing group or create a new one. Groups are best organized
          around a topic.
        </span>
        <div className={classes.buttonWrapper}>
          <IconButton name="group" onClick={this.onClickCreate}>
            Create a new group
          </IconButton>
        </div>
        <div className={classes.input}>
          <InputSearch
            onChange={this.onChangeFilter}
            placeholder="Search for a person ..."
            defaultValue={filterGroups}
            type="search"
          />
        </div>
        {isMemberOfEachChannel && (
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
              actions.onSearchGroups()
            }}
            isRowLoaded={this.isRowLoaded}
            list={list}
            rowCount={Infinity}
            minimumBatchSize={50}
            width={680}
            threshold={30}
            rowRenderer={(index, key, style) => (
              <RowRendererGroups
                actions={actions}
                list={list}
                index={index}
                key={key}
                style={style}
              />
            )}
            noRowsRenderer={() => (
              <NoRowsRendererGroups isGroupsLoaded={isGroupsLoaded} />
            )}
          />
        </div>
      </div>
    )
  }
}

export default injectSheet(styles)(Group)
