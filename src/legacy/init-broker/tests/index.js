import expect from 'expect.js'
import Emitter from 'component-emitter'
import doBroker from '../'
import {room, user, org, chatLine} from '../../tests/fixtures/'

describe('Events Router', () => {
  it('should route user change events', () => {
    const ui = new Emitter({
      setUser(_user) {
        expect(_user).to.eql(user)
      }
    })
    const app = new Emitter({})
    doBroker(ui, app)
    app.emit('changeUser', user)
  })
  it('should route organisation/s change events', () => {
    const ui = new Emitter({
      setOrganizations(_orgs) {
        expect(_orgs).to.be.eql(org)
      },
      setOrganization(_org) {
        expect(_org).to.be.eql(org)
      }
    })
    const app = new Emitter({})
    doBroker(ui, app)
    app.emit('change organizations', org)
    app.emit('change organization', org)
  })
  it('should route room join events', () => {
    const app = new Emitter({
      joinRoom(_room) {
        expect(_room).to.eql(room)
      }
    })
    const ui = new Emitter({})
    doBroker(ui, app)
    ui.emit('joinRoom', room)
  })
  it('should route history requests', () => {
    const ui = new Emitter({
      gotHistory(_room, lines) {
        expect(_room).to.eql(room)
        expect(lines[0]).to.eql(chatLine)
      }
    })
    const app = new Emitter({
      getHistory(_room) {
        expect(_room).to.eql(room)
        this.emit('gotHistory', room, [chatLine])
      }
    })
    doBroker(ui, app)
    ui.emit('needhistory', room)
  })
})
