import React, {Component} from 'react'
import List from 'react-finite-list'
import { constants } from 'conf'


export default class RightSidebar extends Component {
    render() {
        return(
            <div className='right-sidebar-wrapper'>
                {this.renderContent()}
            </div>
        )
    }

    renderListItem({item}) {
        let href = '/chat/' + item.slug
        let deleteButton
        let cUser = this.props.cUser

        if (cUser === this.props.channel.creator || cUser.role >= constants.roles.ROLE_ADMIN) {
            deleteButton = (
                <span>X</span>
            )
        }
        
        return(
            <div>
                <a href={href}>
                    <aside className='avatar-wrap'>
                        <img
                            className='image'
                            width='20'
                            height='20' 
                            src={item.avatar}/>
                    </aside>
                    <span>
                        {item.displayName}
                    </span>
                </a>
                { deleteButton }
            </div>
        )
    }

    renderContent() {        
        switch(this.props.mode) {
            case 'profile':
                let user = this.props.channel.users[0]
                return(
                    <div className='profile'>
                        <div className='right-sidebar-header'>
                            <div className='title'>
                                User profile
                            </div>
                            <div className='avatar-wrap'>
                                <img
                                src={user.avatar}
                                alt={user.username}
                                width="80"
                                height="80" />
                            </div>
                            <div className="fullname">
                                {user.displayName}
                            </div>
                            <div className="username">
                                {user.slug}
                            </div>
                            <div className="user-profile-item">
                                {user.what_i_do}
                            </div>
                            <div className="user-profile-item">
                                <a href={`mailto:${user.email}`}>
                                    {user.email}
                                </a>
                            </div>
                            <div className="user-profile-item">
                                <a href={`skype:${user.skype_username}`}>
                                    {user.skype_username}
                                </a>
                            </div>
                            <div className="user-profile-item">
                                <a href={`tel:${user.phone_number}`}>
                                    {user.phone_number}
                                </a>
                            </div>
                        </div>
                    </div>
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
                let members = this.props.channel.users.toArray()
                return(
                    <div className='members'>
                        <div className='right-sidebar-header'>
                            <span className='title'>
                                Members
                            </span>
                        </div>
                        <List
                            items={members}
                            className='user-list'
                            renderItem={::this.renderListItem}
                            ref='list' />
                        <a
                            className='invite-members'
                            onClick={this.props.toggleRoomInvite}>
                            Invite
                        </a>
                    </div>
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
