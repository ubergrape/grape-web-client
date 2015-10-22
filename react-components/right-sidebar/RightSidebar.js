import React, {Component} from 'react'
import List from 'react-finite-list'

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
        return(
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
        )
    }

    renderContent() {        
        switch(this.props.mode) {
            case 'profile':
                return(
                    <div className='profile'>
                        <div className='right-sidebar-header'>
                            <span className='title'>
                                User profile
                            </span>
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
                            X</span>
                        </div>
                    </div>
                )
                break
            default:
        }

    }
}
