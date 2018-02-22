import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {
  defineMessages,
  FormattedMessage,
  intlShape,
  injectIntl
} from 'react-intl'
import injectclasses from 'grape-web/lib/jss'
import capitalize from 'lodash/string/capitalize'

import Dialog from '../dialog/Dialog'
import {Tab, TabsNav} from '../tabs'
import Group from './Group'
import {styles} from './theme'

const messages = defineMessages({
  dialogTitle: {
    id: 'manageGroupsDialogTitle',
    defaultMessage: 'Manage Groups',
    description: 'Manage Groups Dialog: dialog title'
  },
  linkJoinable: {
    id: 'manageGroupsLinkJoinable',
    defaultMessage: 'Groups you can join',
    description: 'Manage Groups Dialog: show joinable groups link'
  },
  linkJoined: {
    id: 'manageGroupsLinkJoined',
    defaultMessage: 'Groups you belong to',
    description: 'Manage Groups Dialog: show "Groups you belong to" link'
  }
})

@injectclasses(styles)
@injectIntl
export default class ManageGroupsDialog extends PureComponent {
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
    groups: PropTypes.arrayOf(
      PropTypes.object.isRequired
    ),
    activeFilter: PropTypes.string
  }

  static defaultProps = {
    groups: [],
    activeFilter: 'joinable'
  }

  componentDidUpdate(prevProps) {
    const {activeFilter, onLoad, show} = this.props

    if (show && !prevProps.show) {
      onLoad(activeFilter)
    }
  }

  onCreate = () => {
    const {
      onHide,
      createNewGroup
    } = this.props

    onHide()
    createNewGroup()
  }

  renderGroupsList(groups) {
    if (!groups.length) {
      return null
    }

    const {
      onJoin, onLeave, activeFilter
    } = this.props

    const onSelect = activeFilter === 'joined' ? onLeave : onJoin

    return (
      <ul>
        {groups.map(group => (
          <li key={group.id}>
            <Group
              group={group}
              onSelect={onSelect}
              type={activeFilter}
            />
          </li>
        ))}
      </ul>
    )
  }

  renderFilterLink({filter}) {
    const {
      activeFilter,
      intl: {formatMessage},
      onSelectFilter
    } = this.props

    return (
      <Tab active={activeFilter === filter} onClick={onSelectFilter} filter={filter}>
        {formatMessage(messages[`link${capitalize(filter)}`])}
      </Tab>
    )
  }

  renderTitle() {
    const {
      intl: {formatMessage},
      classes
    } = this.props

    return (
      <span className={classes.header}>
        <span className={classes.title}>{formatMessage(messages.dialogTitle)}</span>
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
    const {
      show,
      onHide,
      groups,
      classes
    } = this.props

    return (
      <Dialog
        show={show}
        onHide={onHide}
        title={this.renderTitle()}
      >
        <TabsNav>
          {this.renderFilterLink({filter: 'joinable'})}
          {this.renderFilterLink({filter: 'joined'})}
        </TabsNav>
        <div className={classes.container}>
          {this.renderGroupsList(groups)}
        </div>
      </Dialog>
    )
  }
}
