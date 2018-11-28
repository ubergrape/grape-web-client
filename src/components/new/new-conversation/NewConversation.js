import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'grape-web/lib/jss'
import merge from 'lodash/merge'

import { A11yDialog, A11yDialogStyles } from '../a11y-dialog'
import { Tabs } from '../tabs'
import Person from './Tabs/Person'
import Group from './Tabs/Group'
import CreateNewGroup from './CreateNewGroup/CreateNewGroup'
import styles from './styles/NewConversationStyles'

const NewConversation = ({
  show,
  view,
  tab,
  users,
  groups,
  newRoom,
  filterUsers,
  filterGroups,
  isLoaded,
  isMemberOfEachChannel,
  onHide,
  onChangeTab,
  onChangeView,
  onChangeInputUsers,
  onChangeInputGroups,
  onSearchUsers,
  onSearchGroups,
  onChangeNewRoomName,
  onChangeNewRoomColor,
  onChangeNewRoomType,
  onChangeNewRoomDescription,
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
                        users,
                        isLoaded,
                        filterUsers,
                        isMemberOfEachChannel,
                      },
                      actions: {
                        onSearchUsers,
                        onChangeInputUsers,
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
                        groups,
                        isLoaded,
                        filterGroups,
                        isMemberOfEachChannel,
                      },
                      actions: {
                        onSearchGroups,
                        onChangeInputGroups,
                        onChangeView,
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
            return (
              <CreateNewGroup
                newRoom={newRoom}
                onChangeView={onChangeView}
                onChangeNewRoomColor={onChangeNewRoomColor}
                onChangeNewRoomName={onChangeNewRoomName}
                onChangeNewRoomType={onChangeNewRoomType}
                onChangeNewRoomDescription={onChangeNewRoomDescription}
              />
            )
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
  newRoom: PropTypes.object.isRequired,
  filterUsers: PropTypes.string.isRequired,
  filterGroups: PropTypes.string.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isMemberOfEachChannel: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onChangeTab: PropTypes.func.isRequired,
  onChangeView: PropTypes.func.isRequired,
  onChangeInputUsers: PropTypes.func.isRequired,
  onChangeInputGroups: PropTypes.func.isRequired,
  onSearchUsers: PropTypes.func.isRequired,
  onSearchGroups: PropTypes.func.isRequired,
  onChangeNewRoomName: PropTypes.func.isRequired,
  onChangeNewRoomColor: PropTypes.func.isRequired,
  onChangeNewRoomType: PropTypes.func.isRequired,
  onChangeNewRoomDescription: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
}

export default injectSheet(merge(A11yDialogStyles, styles))(NewConversation)
