import React, {Component} from 'react'
import UserProfile from '../user-profile/UserProfile'
import RoomInfo from '../room-info/RoomInfo'
import FileBrowser from '../file-browser/FileBrowser'
import MessageSearch from '../message-search/MessageSearch'
import {useSheet} from '../jss'
import style from './style'

@useSheet(style)
export default class RightSidebar extends Component {
    render() {
        let {classes} = this.props.sheet
        return(
            <div className={classes.content}>
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
                    <RoomInfo
                        users={this.props.channel.users.toArray()}
                        cUser={this.props.cUser}
                        roomCreator={this.props.channel.creator}
                        toggleRoomInvite={this.props.toggleRoomInvite} />
                )
                break
            case 'search':
                return(
                    <MessageSearch
                        hide={this.props.hide}
                        items={this.props.searchItems} />
                )
                break
            default:
        }

    }
}
