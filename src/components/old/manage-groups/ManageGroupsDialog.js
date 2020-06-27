import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import {
  defineMessages,
  FormattedMessage,
  intlShape,
  injectIntl,
} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import capitalize from 'lodash/capitalize'
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'

import Dialog from '../dialog/Dialog'
import { Tab, TabsNav } from '../tabs'
import Group from './Group'
import { styles } from './theme'

const messages = defineMessages({
  dialogTitle: {
    id: 'manageGroupsDialogTitle',
    defaultMessage: 'Manage Groups',
    description: 'Manage Groups Dialog: dialog title',
  },
  linkUnjoined: {
    id: 'manageGroupsLinkJoinable',
    defaultMessage: 'Groups you can join',
    description: 'Manage Groups Dialog: show joinable groups link',
  },
  linkJoined: {
    id: 'manageGroupsLinkJoined',
    defaultMessage: 'Groups you belong to',
    description: 'Manage Groups Dialog: show "Groups you belong to" link',
  },
})

class ManageGroupsDialog extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    onHide: PropTypes.func.isRequired,
    onSelectFilter: PropTypes.func.isRequired,
    onJoin: PropTypes.func.isRequired,
    onLeave: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    createNewGroup: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    groups: PropTypes.arrayOf(PropTypes.object.isRequired),
    activeFilter: PropTypes.string,
  }

  static defaultProps = {
    groups: [],
    activeFilter: 'unjoined',
  }

  componentDidUpdate(prevProps) {
    const { activeFilter, onLoad, show } = this.props

    if (show && !prevProps.show) {
      onLoad(activeFilter)
    }
  }

  onCreate = () => {
    const { onHide, createNewGroup } = this.props

    onHide()
    createNewGroup()
  }

  isRowLoaded = ({ index }) => !!this.props.groups[index]

  renderGroupsList(groups) {
    if (!groups.length) {
      return null
    }

    const { onJoin, onLeave, onLoad, activeFilter } = this.props

    const onSelect = activeFilter === 'joined' ? onLeave : onJoin

    const rowRenderer = ({ index, key, style }) => (
      <div key={key} style={style}>
        <Group group={groups[index]} onSelect={onSelect} type={activeFilter} />
      </div>
    )

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={onLoad}
        rowCount={groups.length + 10}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer disableHeight>
            {({ width }) => (
              <List
                ref={registerChild}
                height={336}
                onRowsRendered={onRowsRendered}
                rowCount={groups.length}
                rowHeight={58}
                rowRenderer={rowRenderer}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    )
  }

  renderFilterLink({ filter }) {
    const {
      activeFilter,
      intl: { formatMessage },
      onSelectFilter,
    } = this.props

    return (
      <Tab
        active={activeFilter === filter}
        onClick={onSelectFilter}
        filter={filter}
      >
        {formatMessage(messages[`link${capitalize(filter)}`])}
      </Tab>
    )
  }

  renderTitle() {
    const {
      intl: { formatMessage },
      classes,
    } = this.props

    return (
      <span className={classes.header}>
        <span className={classes.title}>
          {formatMessage(messages.dialogTitle)}
        </span>
        <button className={classes.create} onClick={this.onCreate}>
          <FormattedMessage
            id="manageGroupsCreateNew"
            defaultMessage="new conversation"
            description="Manage Groups Dialog: create new conversation button"
          />
        </button>
      </span>
    )
  }

  render() {
    const { show, onHide, groups, classes } = this.props

    if (!show) return null

    return (
      <Dialog show={show} onHide={onHide} title={this.renderTitle()}>
        <TabsNav>
          {this.renderFilterLink({ filter: 'unjoined' })}
          {this.renderFilterLink({ filter: 'joined' })}
        </TabsNav>
        <div className={classes.container}>{this.renderGroupsList(groups)}</div>
      </Dialog>
    )
  }
}

export default injectSheet(styles)(injectIntl(ManageGroupsDialog))
