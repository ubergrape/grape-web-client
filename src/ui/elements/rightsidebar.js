import Emitter from 'emitter'
import '../../../react-components/right-sidebar'

export default class RightSidebar extends Emitter {
    constructor() {
        super()
        this.el = document.createElement('grape-right-sidebar')
        this.el.props = {
            onToggle: ::this.onToggle,
            hide: ::this.hide,
            show: ::this.show,
            toggleRoomInvite: ::this.toggleRoomInvite,
            onShow: ::this.onShow,
            mode: null,
            channel: null,
            cUser: null,
            searchItems: []
        }
    }

    setProps(props) {
        this.el.props = {
            ...this.el.props,
            ...props
        }
    }

    hide() {
        this.setProps({
            mode: null
        })
        this.emit('hide')
    }

    show(mode) {
        this.setProps({
            mode: mode,
            channel: this.el.props.channel
        })
        this.emit('show')
    }

    toggleRoomInvite() {
        this.emit('toggleRoomInvite', this.el.props.channel)
    }

    onToggle(mode) {
        if (mode === this.el.props.mode) this.hide()
        else this.show(mode); 
    }

    onShow(mode) {
        this.show(mode)
    }

    onSelectChannel(channel) {
        let mode = this.el.props.mode
        if (mode === 'members' && channel.type === 'pm') {
            mode = 'profile'
        }
        else if (mode === 'profile' && channel.type === 'room') {
            mode = 'members'
        }
        this.setProps({
            mode: mode,
            channel: channel
        })
    }

    onGotSearchPayload(payload) {
        this.setProps({
            searchItems: payload.results
        })
    }

    onSetUser(user) {
        this.setProps({
            cUser: user
        })
    }
}
