import Emitter from 'emitter'
import page from 'page'
import pick from 'lodash/object/pick'

import '../../../react-components/channel-search'

export default class ChannelSearch extends Emitter {
	constructor() {
		super()
		this.el = document.createElement('grape-channel-search')
		this.el.props = {
			onSelect: ::this.onSelect,
			onCreate: ::this.onCreate,
			onShow: ::this.onShow,
			onHide: ::this.onHide,
			show: false,
			items: []
		}
	}

	setProps(props) {
		this.el.props = {
			...this.el.props,
			...props
		}
	}

	hide() {
		this.setProps({show: false})
	}

	onOrgReady(org) {
		this.org = org
	}

	onSelect(item) {
		page('/chat/' + item.slug)
		this.onHide()
	}

	onCreate() {
		this.hide()
		this.emit('triggerRoomManager')
	}

	onShow() {
		this.setProps({
			show: true,
			items: getItems(this.org)
		})
	}

	onHide() {
		this.hide()
	}
}

function getItems(org) {
	let rooms = org.rooms.map(room => {
		let item = pick(room, 'id', 'name', 'slug', 'color', 'abbr')
		item.isRoom = true
		return item
	})
	let users = org.users.map(({id, displayName, username, avatar}) => {
		return {
			id,
			name: displayName,
			slug: `@${username}`,
			isRoom: false,
			iconUrl: avatar
		}
	})
	return [...users, ...rooms]
}
