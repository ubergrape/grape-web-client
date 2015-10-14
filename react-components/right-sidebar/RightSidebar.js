import React, {Component} from 'react'

export default class RightSidebar extends Component {
    render() {
        return(
            <div className='right-sidebar-wrapper'>
                {this.renderView()}
            </div>
        )
    }

    renderView() {        
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
                return(
                    <div className='members'>
                        <div className='right-sidebar-header'>
                            <span className='title'>
                                Members
                            </span>
                        </div>
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