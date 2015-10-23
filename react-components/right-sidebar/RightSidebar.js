import React, {Component} from 'react'
import UserProfile from '../user-profile/UserProfile'
import RoomMembersManager from '../room-members-manager/RoomMembersManager'

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
                    <div className='file-browser'>
                        <div className='right-sidebar-header'>
                            <span className='title'>
                                Shared files
                            </span>
                        </div>
                    </div>
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
                    <div className='search'>
                        <div className='right-sidebar-header'>
                            <span className='title'>
                                Search your conversations
                            </span>
                            <span
                                className='hide-sidebar'
                                onClick={this.props.hide}>
                                X
                            </span>
                        </div>
                    </div>
                )
                break
            default:
        }

    }
}
