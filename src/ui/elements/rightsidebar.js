import Emitter from 'emitter'
import '../../../react-components/right-sidebar'

export default class RightSidebar extends Emitter {
    constructor() {
        super()
        this.el = document.createElement('grape-right-sidebar')
        this.el.props = {
            onToggle: ::this.onToggle,
            hide: ::this.hide,
            mode: null
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
            mode: mode
        })
        this.emit('show')
    }

    onToggle(mode) {
        if (mode == this.el.props.mode) this.hide();
        else this.show(mode); 
    }
}