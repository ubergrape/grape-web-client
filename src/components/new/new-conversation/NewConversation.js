import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import { merge } from 'lodash'

import { A11yDialog, A11yDialogStyles } from '../a11y-dialog'
import { Tabs } from '../tabs'
import Person from './Tabs/Person'
import Group from './Tabs/Group'
import { CreateRoomProvider as CreateRoom } from '../../../containers/create-room'
import styles from './styles/NewConversationStyles'

const NewConversation = ({
  show,
  view,
  tab,
  users,
  groups,
  filterUsers,
  filterGroups,
  isUsersLoaded,
  isGroupsLoaded,
  isMemberOfEachChannel,
  onHide,
  onChangeTab,
  onChangeView,
  onChangeUsersFilter,
  onChangeGroupsFilter,
  onSearchUsers,
  onSearchGroups,
  goToChannel,
  joinChannel,
  openPm,
  classes,
}) => (
  <A11yDialog
    id="new-conversation"
    title="New conversation"
    show={show}
    onHide={onHide}
    classNames={classes}
    closeButtonLabel="Close new conversation dialog window"
  >
    <div className={classes.wrapper}>
      <p className={classes.description}>
        Start a conversation with one person. Join or create a group to chat
        with more people.
      </p>
      {(() => {
        switch (view) {
          case 'tabs': {
            const tabs = show ? (
              <div className={classes.tabs}>
                <Tabs
                  current={tab}
                  tabs={[
                    {
                      name: 'Person',
                      component: Person,
                      data: {
                        list: users,
                        isUsersLoaded,
                        filterUsers,
                        isMemberOfEachChannel,
                      },
                      actions: {
                        onSearchUsers,
                        onChangeUsersFilter,
                        onChangeView,
                        goToChannel,
                        openPm,
                        onHide,
                      },
                      onLoad: () => {
                        onSearchUsers()
                      },
                      onChange: () => {
                        onChangeTab(0)
                        onSearchUsers()
                      },
                    },
                    {
                      name: 'Group',
                      component: Group,
                      data: {
                        list: groups,
                        isGroupsLoaded,
                        filterGroups,
                        isMemberOfEachChannel,
                      },
                      actions: {
                        onSearchGroups,
                        onChangeGroupsFilter,
                        onChangeView,
                        goToChannel,
                        joinChannel,
                        onHide,
                      },
                      onLoad: () => {
                        onSearchGroups()
                      },
                      onChange: () => {
                        onChangeTab(1)
                        onSearchGroups()
                      },
                    },
                  ]}
                />
              </div>
            ) : null
            return tabs
          }
          case 'create': {
            return <CreateRoom />
          }
          default: {
            return null
          }
        }
      })()}
    </div>
  </A11yDialog>
)

NewConversation.propTypes = {
  show: PropTypes.bool.isRequired,
  view: PropTypes.string.isRequired,
  tab: PropTypes.number.isRequired,
  users: PropTypes.array.isRequired,
  groups: PropTypes.array.isRequired,
  filterUsers: PropTypes.string.isRequired,
  filterGroups: PropTypes.string.isRequired,
  isUsersLoaded: PropTypes.bool.isRequired,
  isGroupsLoaded: PropTypes.bool.isRequired,
  isMemberOfEachChannel: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onChangeTab: PropTypes.func.isRequired,
  onChangeView: PropTypes.func.isRequired,
  onChangeUsersFilter: PropTypes.func.isRequired,
  onChangeGroupsFilter: PropTypes.func.isRequired,
  onSearchUsers: PropTypes.func.isRequired,
  onSearchGroups: PropTypes.func.isRequired,
  goToChannel: PropTypes.func.isRequired,
  joinChannel: PropTypes.func.isRequired,
  openPm: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default injectSheet(merge(A11yDialogStyles, styles))(NewConversation)
