let expect = require('expect.js')
let Emitter = require('emitter')
let doBroker = require('../')
let fixtures = require('../../../tests/fixtures/')
let room = fixtures.room
let user = fixtures.user
let org = fixtures.org
let chatLine = fixtures.chatLine

describe('Events Router', function() {
    it('should route user change events', function() {
        let ui = new Emitter({
            setUser: function(_user) {
                expect(_user).to.eql(user)
            }
        })
        let app = new Emitter({})
        doBroker(ui, app)
        app.emit('changeUser', user)
    })
    it('should route organisation/s change events', function() {
        let ui = new Emitter({
            setOrganizations: function(_orgs) {
                expect(_orgs).to.be.eql(org)
            },
            setOrganization: function(_org) {
                expect(_org).to.be.eql(org)
            }
        })
        let app = new Emitter({})
        doBroker(ui, app)
        app.emit('change organizations', org)
        app.emit('change organization', org)
    })
    it('should route room join events', function() {
        let app = new Emitter({
            joinRoom: function(_room) {
                expect(_room).to.eql(room)
            }
        })
        let ui = new Emitter({})
        doBroker(ui, app)
        ui.emit('joinRoom', room)
    })
    it('should route history requests', function() {
        let ui = new Emitter({
            gotHistory: function(_room, lines) {
                expect(_room).to.eql(room)
                expect(lines[0]).to.eql(chatLine)
            }
        })
        let app = new Emitter({
            getHistory: function(_room) {
                expect(_room).to.eql(room)
                this.emit('gotHistory', room, [chatLine])
            }
        })
        doBroker(ui, app)
        ui.emit('needhistory', room)
    })
})
