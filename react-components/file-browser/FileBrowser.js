import React, {Component} from 'react'

export default class FileBrowser extends Component {
  static defaultProps = {
    show: false
  }
  render() {
    if (!this.props.show) return null
    return (
      <div className='file-browser'>
       <div className='header'>
         <span className='title'>
           Shared files
         </span>
       </div>
      </div>
    )
  }
}
