import expect from 'expect.js'
import qs from 'query'
import MDTip from '../markdowntips'
import RoomDelete from '../deleteroom'
import RoomManager from '../roommanager'
import fixtures from '../../../../../tests/fixtures/'
import template from 'template'

let room = fixtures.room
let user = fixtures.user
template.locals.user = user

let mdTip = new MDTip()
let roomDelete = new RoomDelete({
    room: room
})
let roomManager = new RoomManager({
    rooms: [room]
})

describe('Dialog', function() {
    describe('Markdown Dialog', function() {
        it('should have a DOM element', function() {
            expect(mdTip).to.have.property('el')
            expect(mdTip.el).to.be.an(Element)
        })
        it('should open', function() {
            mdTip.show()
            let el = qs('.markdown-tips', mdTip.el)
            expect(el).not.to.be(null)
        })
    })
    describe('Room Delete Dialog', function() {
        it('should have a DOM element', function() {
            expect(roomDelete).to.have.property('el')
            expect(roomDelete.el).to.be.an(Element)
        })
        it('should open', function() {
            roomDelete.show()
            let el = qs('.delete-room', roomDelete.el)
            expect(el).not.to.be(null)
        })
    })
    describe('Room Manager', function() {
        it('should have a DOM element', function() {
            expect(roomManager).to.have.property('el')
            expect(roomManager.el).to.be.an(Element)
        })
        it('should open', function() {
            roomManager.show()
            let el = qs('.room-list-container', roomManager.el)
            expect(el).not.to.be(null)
        })
    })
})
