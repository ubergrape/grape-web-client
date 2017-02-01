import expect from 'expect.js'
import qs from 'component-query'

import staticUrl from '../../../../../utils/static-url'
import RoomDelete from '../deleteroom'
import {room, user} from '../../../../tests/fixtures/'
import template from 'template'
import '../../../../templates'

template.locals.user = user
template.locals.staticUrl = staticUrl

const roomDelete = new RoomDelete({
  room
})

describe('Dialog', () => {
  describe('Room Delete Dialog', () => {
    it('should have a DOM element', () => {
      expect(roomDelete).to.have.property('el')
      expect(roomDelete.el).to.be.an(Element)
    })
    it('should open', () => {
      roomDelete.show()
      const el = qs('.delete-room', roomDelete.el)
      expect(el).not.to.be(null)
    })
  })
})
