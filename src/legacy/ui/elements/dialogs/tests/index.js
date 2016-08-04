import expect from 'expect.js'
import qs from 'query'
import staticurl from 'staticurl'
import MDTip from '../markdowntips'
import RoomDelete from '../deleteroom'
import RoomManager from '../roommanager'
import {room, user} from '../../../../tests/fixtures/'
import template from 'template'
import '../../../../templates'

template.locals.user = user
template.locals.staticurl = staticurl

let mdTip = new MDTip()
let roomDelete = new RoomDelete({
  room: room
})
let roomManager = new RoomManager({
  rooms: [room]
})

describe('Dialog', () => {
  describe('Markdown Dialog', () => {
    it('should have a DOM element', () => {
      expect(mdTip).to.have.property('el')
      expect(mdTip.el).to.be.an(Element)
    })
    it('should open', () => {
      mdTip.show()
      let el = qs('.markdown-tips', mdTip.el)
      expect(el).not.to.be(null)
    })
  })
  describe('Room Delete Dialog', () => {
    it('should have a DOM element', () => {
      expect(roomDelete).to.have.property('el')
      expect(roomDelete.el).to.be.an(Element)
    })
    it('should open', () => {
      roomDelete.show()
      let el = qs('.delete-room', roomDelete.el)
      expect(el).not.to.be(null)
    })
  })
  describe('Room Manager', () => {
    it('should have a DOM element', () => {
      expect(roomManager).to.have.property('el')
      expect(roomManager.el).to.be.an(Element)
    })
    it('should open', () => {
      roomManager.show()
      let el = qs('.room-list-container', roomManager.el)
      expect(el).not.to.be(null)
    })
  })
})
