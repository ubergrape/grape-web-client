let expect = require('expect.js')
let qs = require('query')
let MDTip = require('../markdowntips')
let RoomDelete = require('../deleteroom')
let RoomManager = require('../roommanager')
let fixtures = require('../../../../../tests/fixtures/')
let room = fixtures.room
let user = fixtures.user
let template = require('template')
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
