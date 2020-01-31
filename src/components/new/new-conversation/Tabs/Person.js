import React, { Component } from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'grape-web/lib/jss'
import { debounce } from 'lodash'
import { debouncingTime } from 'grape-web/lib/constants/time'

import { InputSearch } from '../../input'
import { InfiniteAutoRowHeightList } from '../../list'
import NoRowsRendererUsers from '../NoRowsRenderers/NoRowsRendererUsers'
import RowRendererUsers from '../RowRenderers/RowRendererUsers'
import EmptyOrgUsers from '../EmptyOrg/EmptyOrgUsers'
import styles from '../styles/TabStyles'

class Person extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  }

  onChangeFilterDebounced = debounce(value => {
    const { onChangeUsersFilter, onSearchUsers } = this.props.actions
    onChangeUsersFilter(value)
    onSearchUsers()
  }, debouncingTime)

  onChangeFilter = ({ target }) => {
    const { value } = target
    this.onChangeFilterDebounced(value)
  }

  isRowLoaded = index => Boolean(this.props.data.list[index])

  rowHeight = (list, index) => {
    if (list[index].text) return 70
    return 40
  }

  render() {
    const { classes, data, actions } = this.props
    const { list, isUsersLoaded, filterUsers, isMemberOfEachChannel } = data

    if (!list.length && isUsersLoaded && !filterUsers)
      return <EmptyOrgUsers onClick={() => {}} />

    return (
      <div className={classes.tab}>
        <div className={classes.input}>
          <InputSearch
            onChange={this.onChangeFilter}
            placeholder="Search for a person ..."
            defaultValue={filterUsers}
            type="search"
          />
        </div>
        {isMemberOfEachChannel && (
          <div>
            <h3 className={classes.title}>
              You are a very communicative person!
            </h3>
            <p className={classes.text}>
              All your coworkers are already chatting with you. Keep in touch
              them.
            </p>
          </div>
        )}
        {isUsersLoaded && (
          <div className={classes.list}>
            <InfiniteAutoRowHeightList
              rowHeight={this.rowHeight}
              loadMoreRows={() => {
                actions.onSearchUsers()
              }}
              isRowLoaded={this.isRowLoaded}
              list={list}
              rowCount={Infinity}
              minimumBatchSize={50}
              width={680}
              threshold={30}
              rowRenderer={(index, key, style) => (
                <RowRendererUsers
                  actions={actions}
                  list={list}
                  index={index}
                  key={key}
                  style={style}
                />
              )}
              noRowsRenderer={() => <NoRowsRendererUsers />}
            />
          </div>
        )}
      </div>
    )
  }
}

export default injectSheet(styles)(Person)
