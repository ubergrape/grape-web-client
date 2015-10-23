import React, {Component} from 'react'
import UserProfile from '../user-profile/UserProfile'
import RoomMembersManager from '../room-members-manager/RoomMembersManager'
import FileBrowser from '../file-browser/FileBrowser'
import MessageSearch from '../message-search/MessageSearch'

export default class RightSidebar extends Component {
    render() {
        return(
            <div className='right-sidebar-wrapper'>
                {this.renderContent()}
            </div>
        )
    }

    renderContent() {        
        switch(this.props.mode) {
            case 'profile':
                return(
                    <UserProfile user={this.props.channel.users[0]} />
                )
                break
            case 'file':
                return(
                    <FileBrowser />
                )
                break
            case 'members':
                return(
                    <RoomMembersManager
                        users={this.props.channel.users.toArray()}
                        cUser={this.props.cUser}
                        roomCreator={this.props.channel.creator}
                        toggleRoomInvite={this.props.toggleRoomInvite} />
                )
                break
            case 'search':
                return(
                    <MessageSearch
                        hide={this.props.hide} />
                )
                break
            default:
        }

    }
}
