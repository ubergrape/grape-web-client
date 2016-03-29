import expect from 'expect.js'
import Emitter from 'emitter'
import doBroker from '../'
import {room, user, org, chatLine} from '../../tests/fixtures/'

describe('Events Router', () => {
  it('should route user change events', () => {
    let ui = new Emitter({
      setUser: function (_user) {
        expect(_user).to.eql(user)
      }
    })
    let app = new Emitter({})
    doBroker(ui, app)
    app.emit('changeUser', user)
  })
  it('should route organisation/s change events', () => {
    let ui = new Emitter({
      setOrganizations: function (_orgs) {
        expect(_orgs).to.be.eql(org)
      },
      setOrganization: function (_org) {
        expect(_org).to.be.eql(org)
      }
    })
    let app = new Emitter({})
    doBroker(ui, app)
    app.emit('change organizations', org)
    app.emit('change organization', org)
  })
  it('should route room join events', () => {
    let app = new Emitter({
      joinRoom: function (_room) {
        expect(_room).to.eql(room)
      }
    })
    let ui = new Emitter({})
    doBroker(ui, app)
    ui.emit('joinRoom', room)
  })
  it('should route history requests', () => {
    let ui = new Emitter({
      gotHistory: function (_room, lines) {
        expect(_room).to.eql(room)
        expect(lines[0]).to.eql(chatLine)
      }
    })
    let app = new Emitter({
      getHistory: function (_room) {
        expect(_room).to.eql(room)
        this.emit('gotHistory', room, [chatLine])
      }
    })
    doBroker(ui, app)
    ui.emit('needhistory', room)
  })
})
